import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from '../../entities/schedule.entity';
import { User } from '../../entities/user.entity';
import { Trip } from '../../entities/trip.entity';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, User, Trip])],
  providers: [ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}