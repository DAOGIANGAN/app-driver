import { Test, TestingModule } from '@nestjs/testing';
import { FcmTokenService } from './fcm_token.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FCMToken } from 'src/entities/fcm-token.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';

describe('FcmTokenService', () => {
  let service: FcmTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FcmTokenService,
        {
          provide: getRepositoryToken(FCMToken),
          useValue: {
            // mock methods
          },
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: {
            // mock methods
          },
        },
      ],
    }).compile();

    service = module.get<FcmTokenService>(FcmTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
