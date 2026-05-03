import { Test, TestingModule } from '@nestjs/testing';
import { FixedTripRequestService } from './fixed-trip-request.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FixedTripRequest, RequestStatus } from 'src/entities/fixed-trip-request.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

const mockRequestRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
});
const mockUserRepo = () => ({
  findOneBy: jest.fn(),
  findOne: jest.fn(),
});

describe('FixedTripRequestService', () => {
  let service: FixedTripRequestService;
  let requestRepo: jest.Mocked<Repository<FixedTripRequest>>;
  let userRepo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FixedTripRequestService,
        { provide: getRepositoryToken(FixedTripRequest), useFactory: mockRequestRepo },
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
      ],
    }).compile();

    service = module.get<FixedTripRequestService>(FixedTripRequestService);
    requestRepo = module.get(getRepositoryToken(FixedTripRequest));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRequest', () => {
    it('should throw if requester or requestee not found', async () => {
      userRepo.findOneBy.mockResolvedValueOnce(null);
      await expect(
        service.createRequest(1, 2, {
          requestedDay: 'Monday', startTime: '08:00', endTime: '09:00', startLocation: 'A', destination: 'B',
        })
      ).rejects.toThrow();
    });
    it('should throw if requesterId === requesteeId', async () => {
      userRepo.findOneBy.mockResolvedValue({});
      await expect(
        service.createRequest(1, 1, {
          requestedDay: 'Monday', startTime: '08:00', endTime: '09:00', startLocation: 'A', destination: 'B',
        })
      ).rejects.toThrow();
    });
    it('should create and save a new request', async () => {
      userRepo.findOneBy.mockResolvedValueOnce({ id: 1 } as User);
      userRepo.findOneBy.mockResolvedValueOnce({ id: 2 } as User);
      const mockRequest = { id: 10 } as FixedTripRequest;
      requestRepo.create.mockReturnValue(mockRequest);
      requestRepo.save.mockResolvedValue(mockRequest);
      const result = await service.createRequest(1, 2, {
        requestedDay: 'Monday', startTime: '08:00', endTime: '09:00', startLocation: 'A', destination: 'B',
      });
      expect(requestRepo.create).toHaveBeenCalled();
      expect(requestRepo.save).toHaveBeenCalledWith(mockRequest);
      expect(result).toBe(mockRequest);
    });
  });

  describe('getReceivedRequests', () => {
    it('should call find with correct params', async () => {
      const mockResult = [{ id: 1 }];
      requestRepo.find.mockResolvedValue(mockResult as any);
      const result = await service.getReceivedRequests(2);
      expect(requestRepo.find).toHaveBeenCalledWith({
        where: { requestee: { id: 2 }, status: RequestStatus.PENDING },
        relations: ['requester', 'requester.profile'],
      });
      expect(result).toBe(mockResult);
    });
  });
});
