import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Profile } from 'src/entities/profile.entity';

const mockService = {
  createOrUpdateProfile: jest.fn(),
  searchProfilesByUserName: jest.fn(),
  getProfileByUserId: jest.fn(),
};

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.createOrUpdateProfile on createOrUpdateProfile', () => {
    const req = { user: { id: 1 } };
    const data: Partial<Profile> = { name: 'Test' };
    controller.createOrUpdateProfile(req, data);
    expect(service.createOrUpdateProfile).toHaveBeenCalledWith(1, data);
  });

  it('should call service.searchProfilesByUserName on searchProfiles', () => {
    controller.searchProfiles('abc');
    expect(service.searchProfilesByUserName).toHaveBeenCalledWith('abc');
  });

  it('should call service.getProfileByUserId on getProfileByUserId', () => {
    controller.getProfileByUserId(5);
    expect(service.getProfileByUserId).toHaveBeenCalledWith(5);
  });
});
