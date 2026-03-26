// filepath: e:\AppDriver\app-driver\src\modules\fixed-trip-request\fixed-trip-request.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixedTripRequest } from 'src/entities/fixed-trip-request.entity';
import { User } from 'src/entities/user.entity';
import { FixedTripRequestController } from './fixed-trip-request.controller';
import { FixedTripRequestService } from './fixed-trip-request.service';

@Module({
  imports: [TypeOrmModule.forFeature([FixedTripRequest, User])],
  controllers: [FixedTripRequestController],
  providers: [FixedTripRequestService],
})
export class FixedTripRequestModule {}