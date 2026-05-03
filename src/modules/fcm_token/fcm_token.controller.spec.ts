import { Test, TestingModule } from '@nestjs/testing';
import { FcmTokenController } from './fcm_token.controller';
import { FcmTokenService } from './fcm_token.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FCMToken } from 'src/entities/fcm-token.entity';
import { RefreshToken } from 'src/entities/refresh-token.entity';

describe('FcmTokenController', () => {
  let controller: FcmTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FcmTokenController],
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

    controller = module.get<FcmTokenController>(FcmTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
