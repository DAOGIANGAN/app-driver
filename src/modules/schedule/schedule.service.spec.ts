import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Schedule } from '../../entities/schedule.entity';
import { User } from '../../entities/user.entity';
import { Trip } from '../../entities/trip.entity';
import { Repository } from 'typeorm';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let scheduleRepository: Repository<Schedule>;
  let userRepository: Repository<User>;
  let tripRepository: Repository<Trip>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: getRepositoryToken(Schedule),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Trip),
          useValue: {
            // Mock methods for Trip repository can be added here later
          },
        },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
    scheduleRepository = module.get<Repository<Schedule>>(getRepositoryToken(Schedule));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    tripRepository = module.get<Repository<Trip>>(getRepositoryToken(Trip));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSchedule', () => {
    it('should create and save a schedule', async () => {
      const user = { id: 1 } as User;
      const scheduleData = { dayOfWeek: 'Monday' };
      const schedule = { id: 1, ...scheduleData, user } as Schedule;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(scheduleRepository, 'create').mockReturnValue(schedule);
      jest.spyOn(scheduleRepository, 'save').mockResolvedValue(schedule);

      const result = await service.createSchedule(1, scheduleData);

      expect(result).toBe(schedule);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(scheduleRepository.create).toHaveBeenCalledWith({ ...scheduleData, user });
      expect(scheduleRepository.save).toHaveBeenCalledWith(schedule);
    });
  });

  describe('getSchedulesByUser', () => {
    it('should return schedules for a user', async () => {
      const schedules = [{ id: 1 }] as Schedule[];
      jest.spyOn(scheduleRepository, 'find').mockResolvedValue(schedules);

      const result = await service.getSchedulesByUser(1);

      expect(result).toBe(schedules);
      expect(scheduleRepository.find).toHaveBeenCalledWith({ where: { user: { id: 1 } } });
    });
  });

  describe('updateSchedule', () => {
    it('should update and save a schedule', async () => {
      const schedule = { id: 1, dayOfWeek: 'Monday' } as Schedule;
      const updatedData = { dayOfWeek: 'Tuesday' };

      jest.spyOn(scheduleRepository, 'findOne').mockResolvedValue(schedule);
      jest.spyOn(scheduleRepository, 'save').mockResolvedValue({ ...schedule, ...updatedData });

      const result = await service.updateSchedule(1, updatedData);

      expect(result).toEqual({ ...schedule, ...updatedData });
      expect(scheduleRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(scheduleRepository.save).toHaveBeenCalledWith({ ...schedule, ...updatedData });
    });
  });

  describe('deleteSchedule', () => {
    it('should delete a schedule', async () => {
      const schedule = { id: 1 } as Schedule;

      jest.spyOn(scheduleRepository, 'findOne').mockResolvedValue(schedule);
      jest.spyOn(scheduleRepository, 'remove').mockResolvedValue(schedule);

      await service.deleteSchedule(1);

      expect(scheduleRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(scheduleRepository.remove).toHaveBeenCalledWith(schedule);
    });
  });
});