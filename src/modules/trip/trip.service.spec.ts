import { Test, TestingModule } from '@nestjs/testing';
import { TripService } from './trip.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Trip } from 'src/entities/trip.entity';
import { User } from 'src/entities/user.entity';
import { FixedTripRequest } from 'src/entities/fixed-trip-request.entity';
import { RoomTripGateway } from './roomTrip.gateway';
import { BlackListService } from '../black-list/black-list.service';

describe('TripService', () => {
  let service: TripService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripService,
        {
          provide: getRepositoryToken(Trip),
          useValue: {
            // mock methods
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            // mock methods
          },
        },
        {
          provide: getRepositoryToken(FixedTripRequest),
          useValue: {
            // mock methods
          },
        },
        {
          provide: RoomTripGateway,
          useValue: {
            // mock methods
          },
        },
        {
          provide: BlackListService,
          useValue: {
            // mock methods
          },
        },
      ],
    }).compile();

    service = module.get<TripService>(TripService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
