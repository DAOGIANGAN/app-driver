import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokenController } from './refresh_token.controller';
import { RefreshTokenService } from './refresh_token.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { FcmTokenService } from '../fcm_token/fcm_token.service';

describe('RefreshTokenController', () => {
  let controller: RefreshTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefreshTokenController],
      providers: [
        RefreshTokenService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: FcmTokenService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RefreshTokenController>(RefreshTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
