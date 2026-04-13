import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../../entities/schedule.entity';
import { User } from '../../entities/user.entity';
import { Trip } from '../../entities/trip.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) {}

  async createSchedule(userId: number, scheduleData: Partial<Schedule>): Promise<Schedule> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const schedule = this.scheduleRepository.create({ ...scheduleData, user });
    return this.scheduleRepository.save(schedule);
  }

  async createSchedules(userId: number, schedules: Partial<Schedule>[]): Promise<Schedule[]> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['schedules'] });
    if (!user) {
      throw new Error('User not found');
    }

    // Remove existing schedules for the user
    if (user.schedules && user.schedules.length > 0) {
      await this.scheduleRepository.remove(user.schedules);
    }

    // Create and save new schedules
    const scheduleEntities = schedules.map((schedule) =>
      this.scheduleRepository.create({ ...schedule, user }),
    );
    return this.scheduleRepository.save(scheduleEntities);
  }

  async getSchedulesByUser(userId: number): Promise<Schedule[]> {
    return this.scheduleRepository.find({ where: { user: { id: userId } } });
  }

  async updateSchedule(scheduleId: number, scheduleData: Partial<Schedule>): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({ where: { id: scheduleId } });
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    Object.assign(schedule, scheduleData);
    return this.scheduleRepository.save(schedule);
  }

  async deleteSchedule(scheduleId: number): Promise<void> {
    const schedule = await this.scheduleRepository.findOne({ where: { id: scheduleId } });
    if (!schedule) {
      throw new Error('Schedule not found');
    }

    await this.scheduleRepository.remove(schedule);
  }

  async compareSchedules(
    userId1: number,
    userId2: number,
  ): Promise<
    {
      previousSchedule1: Schedule;
      previousSchedule2: Schedule;
      nextSchedule1: Schedule;
      nextSchedule2: Schedule;
      driverId: number;
      driverName: string;
      phoneNumber: string;
      urlPublicAvatar: string;
    }[]
  > {
    const user1Schedules = await this.scheduleRepository.find({
      where: { user: { id: userId1 } },
    });
    const user2 = await this.userRepository.findOne({
      where: { id: userId2 },
      relations: ['profile', 'schedules'],
    });

    if (!user2) {
      throw new NotFoundException(`User with id ${userId2} not found`);
    }
    const user2Schedules = user2.schedules;

    const matchingSchedules: Array<{
      previousSchedule1: Schedule;
      previousSchedule2: Schedule;
      nextSchedule1: Schedule;
      nextSchedule2: Schedule;
      driverId: number;
      driverName: string;
      phoneNumber: string;
      urlPublicAvatar: string;
    }> = [];

    for (const schedule1 of user1Schedules) {
      for (const schedule2 of user2Schedules) {
        // 1. Kiểm tra môn học TRƯỚC: cùng ngày, cùng giờ kết thúc, cùng địa điểm
        if (
          schedule1.dayOfWeek === schedule2.dayOfWeek &&
          schedule1.endTime === schedule2.endTime &&
          schedule1.location === schedule2.location
        ) {
          // 2. Tìm một cặp môn học SAU phù hợp cho cả hai người dùng
          const nextSchedule1 = user1Schedules.find(
            (s) =>
              s.dayOfWeek === schedule1.dayOfWeek &&
              s.startTime > schedule1.endTime,
          );

          if (nextSchedule1) {
            const nextSchedule2 = user2Schedules.find(
              (s) =>
                s.dayOfWeek === schedule2.dayOfWeek &&
                s.startTime === nextSchedule1.startTime && // Cùng giờ bắt đầu môn sau
                s.location === nextSchedule1.location, // Cùng địa điểm môn sau
            );

            // 3. Nếu tìm thấy một cặp môn sau phù hợp VÀ giảng đường khác nhau
            if (
              nextSchedule2 &&
              schedule1.location !== nextSchedule1.location
            ) {
              matchingSchedules.push({
                previousSchedule1: schedule1,
                previousSchedule2: schedule2,
                nextSchedule1: nextSchedule1,
                nextSchedule2: nextSchedule2,
                driverId: user2.id,
                driverName: user2.profile.name,
                phoneNumber: user2.profile.phone,
                urlPublicAvatar: user2.profile.urlPublicAvatar,
              });
              console.log('Found matching schedules:', matchingSchedules);
              // Thoát khỏi vòng lặp bên trong vì đã tìm thấy cặp phù hợp cho schedule1
              break;
            }
          }
        }
      }
    }

    return matchingSchedules;
  }

  async compareWithLastDriverSchedule(
    userId: number,
  ): Promise<
    {
      previousSchedule1: Schedule;
      previousSchedule2: Schedule;
      nextSchedule1: Schedule;
      nextSchedule2: Schedule;
      driverId: number;
      driverName: string;
      phoneNumber: string;
      urlPublicAvatar: string;
    }[]
  > {
    // 1. Find the most recent trip for the user as a customer
    const lastTrip = await this.tripRepository.findOne({
      where: {
        approvedCustomers: { id: userId },
      },
      order: {
        departureTime: 'DESC',
      },
      relations: ['driver'],
    });

    if (!lastTrip || !lastTrip.driver) {
      return [];
    }

    const driverId = lastTrip.driver.id;

    // 2. Compare schedules with the driver of the last trip
    return this.compareSchedules(userId, driverId);
  }
}