import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

const mockProfileRepo = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
});
const mockUserRepo = () => ({
  findOne: jest.fn(),
});

describe('ProfileService', () => {
  let service: ProfileService;
  let profileRepo: jest.Mocked<Repository<Profile>>;
  let userRepo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: getRepositoryToken(Profile), useFactory: mockProfileRepo },
        { provide: getRepositoryToken(User), useFactory: mockUserRepo },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profileRepo = module.get(getRepositoryToken(Profile));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrUpdateProfile', () => {
    it('should throw if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.createOrUpdateProfile(1, {})).rejects.toThrow('User not found');
    });
    it('should update existing profile', async () => {
      const user = { id: 1, profile: { id: 2, name: 'Old' } } as any;
      userRepo.findOne.mockResolvedValue(user);
      profileRepo.save.mockResolvedValue({ ...user.profile, name: 'New' });
      const result = await service.createOrUpdateProfile(1, { name: 'New' });
      expect(profileRepo.save).toHaveBeenCalledWith({ ...user.profile, name: 'New' });
      expect(result.name).toBe('New');
    });
    it('should create new profile if not exists', async () => {
      const user = { id: 1, profile: null } as any;
      userRepo.findOne.mockResolvedValue(user);
      const newProfile = { id: 3, name: 'Test', user };
      profileRepo.create.mockReturnValue(newProfile as any);
      profileRepo.save.mockResolvedValue(newProfile as any);
      const result = await service.createOrUpdateProfile(1, { name: 'Test' });
      expect(profileRepo.create).toHaveBeenCalledWith({ name: 'Test', user });
      expect(profileRepo.save).toHaveBeenCalledWith(newProfile);
      expect(result).toBe(newProfile);
    });
  });

  describe('getProfileByUserId', () => {
    it('should throw if profile not found', async () => {
      profileRepo.findOne.mockResolvedValue(null);
      await expect(service.getProfileByUserId(1)).rejects.toThrow('Profile not found for this user.');
    });
    it('should return profile with userId and isActivated', async () => {
      const profile = { id: 2, user: { id: 1, isActivated: true } } as any;
      profileRepo.findOne.mockResolvedValue(profile);
      const result = await service.getProfileByUserId(1);
      expect(result.userId).toBe(1);
      expect(result.isActivated).toBe(true);
    });
  });

  describe('searchProfilesByUserName', () => {
    it('should call find with correct params', async () => {
      const mockResult = [{ id: 1 }];
      profileRepo.find.mockResolvedValue(mockResult as any);
      const result = await service.searchProfilesByUserName('abc');
      expect(profileRepo.find).toHaveBeenCalledWith({
        where: { username: expect.any(Object) },
        relations: ['user'],
      });
      expect(result).toBe(mockResult);
    });
  });
});
