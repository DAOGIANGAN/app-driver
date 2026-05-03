import { Test, TestingModule } from '@nestjs/testing';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Trip } from 'src/entities/trip.entity';
import { User } from 'src/entities/user.entity';
import { FixedTripRequest } from 'src/entities/fixed-trip-request.entity';
import { RoomTripGateway } from './roomTrip.gateway';
import { BlackListService } from '../black-list/black-list.service';

describe('TripController', () => {
  let controller: TripController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripController],
      providers: [
        TripService,
        {
          provide: getRepositoryToken(Trip),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: getRepositoryToken(FixedTripRequest),
          useValue: {},
        },
        {
          provide: RoomTripGateway,
          useValue: {},
        },
        {
          provide: BlackListService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TripController>(TripController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
