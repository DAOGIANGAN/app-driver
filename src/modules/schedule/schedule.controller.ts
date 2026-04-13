import { Controller, Post, Get, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from '../../entities/schedule.entity';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';
import { U } from 'node_modules/@faker-js/faker/dist/airline-DF6RqYmq';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('compare')
  @UseGuards(JwtAccessAuthGuard)
  async compareSchedules(
    @Query('userId1') userId1: number,
    @Query('userId2') userId2: number,
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
    return this.scheduleService.compareSchedules(userId1, userId2);
  }

  @Get('compareWithLastTripDriver')
  @UseGuards(JwtAccessAuthGuard)
  async compareWithLastDriverSchedule(
    @Query('userId') userId: number,
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
    return this.scheduleService.compareWithLastDriverSchedule(userId);
  }

  @Post(':userId')
  @UseGuards(JwtAccessAuthGuard)
  async createSchedule(
    @Param('userId') userId: number,
    @Body() scheduleData: Partial<Schedule>,
  ): Promise<Schedule> {
    return this.scheduleService.createSchedule(userId, scheduleData);
  }

  @Get(':userId')
  @UseGuards(JwtAccessAuthGuard)
  async getSchedulesByUser(@Param('userId') userId: number): Promise<Schedule[]> {
    return this.scheduleService.getSchedulesByUser(userId);
  }

  @Patch(':scheduleId')
  @UseGuards(JwtAccessAuthGuard)
  async updateSchedule(
    @Param('scheduleId') scheduleId: number,
    @Body() scheduleData: Partial<Schedule>,
  ): Promise<Schedule> {
    return this.scheduleService.updateSchedule(scheduleId, scheduleData);
  }

  @Delete(':scheduleId')
  @UseGuards(JwtAccessAuthGuard)
  async deleteSchedule(@Param('scheduleId') scheduleId: number): Promise<void> {
    return this.scheduleService.deleteSchedule(scheduleId);
  }

  @Post(':userId/bulk')
  @UseGuards(JwtAccessAuthGuard)
  async createSchedules(
    @Param('userId') userId: number,
    @Body() schedules: Partial<Schedule>[],
  ): Promise<Schedule[]> {
    return this.scheduleService.createSchedules(userId, schedules);
  }
  
}