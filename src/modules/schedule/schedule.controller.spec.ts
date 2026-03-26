import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

describe('ScheduleController', () => {
  let controller: ScheduleController;
  let service: ScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [
        {
          provide: ScheduleService,
          useValue: {
            createSchedule: jest.fn(),
            getSchedulesByUser: jest.fn(),
            updateSchedule: jest.fn(),
            deleteSchedule: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ScheduleController>(ScheduleController);
    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createSchedule', () => {
    it('should call service.createSchedule and return the result', async () => {
      const result = { id: 1 };
      jest.spyOn(service, 'createSchedule').mockResolvedValue(result as any);

      expect(await controller.createSchedule(1, {})).toBe(result);
      expect(service.createSchedule).toHaveBeenCalledWith(1, {});
    });
  });

  describe('getSchedulesByUser', () => {
    it('should call service.getSchedulesByUser and return the result', async () => {
      const result = [{ id: 1 }];
      jest.spyOn(service, 'getSchedulesByUser').mockResolvedValue(result as any);

      expect(await controller.getSchedulesByUser(1)).toBe(result);
      expect(service.getSchedulesByUser).toHaveBeenCalledWith(1);
    });
  });

  describe('updateSchedule', () => {
    it('should call service.updateSchedule and return the result', async () => {
      const result = { id: 1 };
      jest.spyOn(service, 'updateSchedule').mockResolvedValue(result as any);

      expect(await controller.updateSchedule(1, {})).toBe(result);
      expect(service.updateSchedule).toHaveBeenCalledWith(1, {});
    });
  });

  describe('deleteSchedule', () => {
    it('should call service.deleteSchedule', async () => {
      jest.spyOn(service, 'deleteSchedule').mockResolvedValue();

      await controller.deleteSchedule(1);
      expect(service.deleteSchedule).toHaveBeenCalledWith(1);
    });
  });
});