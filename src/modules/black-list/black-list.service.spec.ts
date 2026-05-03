import { Test, TestingModule } from '@nestjs/testing';
import { BlackListService } from './black-list.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserBlackList } from 'src/entities/userBlackList.entity';

describe('BlackListService', () => {
  let service: BlackListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlackListService,
        {
          provide: getRepositoryToken(UserBlackList),
          useValue: {
            // Thêm các phương thức giả lập bạn cần ở đây
            findOne: jest.fn(),
            insert: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BlackListService>(BlackListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
