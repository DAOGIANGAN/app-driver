import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { User } from 'src/entities/user.entity';
import { Trip } from 'src/entities/trip.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { TripGateway } from './trip.gateway';
import { RoomTripGateway } from './roomTrip.gateway';
import { FixedTripRequest } from 'src/entities/fixed-trip-request.entity';

@Module({
  controllers: [TripController],
  providers: [TripService, TripGateway,RoomTripGateway],
  exports: [TripService],
  imports: [PassportModule, TypeOrmModule.forFeature([Trip, User, FixedTripRequest])],
})
export class TripModule {}
