import { Test, TestingModule } from '@nestjs/testing';
import { FixedTripRequestController } from './fixed-trip-request.controller';
import { FixedTripRequestService } from './fixed-trip-request.service';

// Mock service
const mockService = {
  createRequest: jest.fn(),
  getReceivedRequests: jest.fn(),
  approveRequest: jest.fn(),
  rejectRequest: jest.fn(),
};

describe('FixedTripRequestController', () => {
  let controller: FixedTripRequestController;
  let service: FixedTripRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FixedTripRequestController],
      providers: [
        {
          provide: FixedTripRequestService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<FixedTripRequestController>(FixedTripRequestController);
    service = module.get<FixedTripRequestService>(FixedTripRequestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.createRequest on createRequest', () => {
    const req = { user: { id: 1 } };
    const body = {
      requesteeId: 2,
      requestedDay: 'Monday',
      startTime: '08:00',
      endTime: '09:00',
      startLocation: 'A',
      destination: 'B',
    };
    controller.createRequest(req, body);
    expect(service.createRequest).toHaveBeenCalledWith(1, 2, {
      requestedDay: 'Monday',
      startTime: '08:00',
      endTime: '09:00',
      startLocation: 'A',
      destination: 'B',
    });
  });

  it('should call service.getReceivedRequests on getReceivedRequests', () => {
    const req = { user: { id: 1 } };
    controller.getReceivedRequests(req);
    expect(service.getReceivedRequests).toHaveBeenCalledWith(1);
  });

  it('should call service.approveRequest on approveRequest', () => {
    const req = { user: { id: 1 } };
    controller.approveRequest(req, 5);
    expect(service.approveRequest).toHaveBeenCalledWith(5, 1);
  });

  it('should call service.rejectRequest on rejectRequest', () => {
    const req = { user: { id: 1 } };
    controller.rejectRequest(req, 7);
    expect(service.rejectRequest).toHaveBeenCalledWith(7, 1);
  });
});
