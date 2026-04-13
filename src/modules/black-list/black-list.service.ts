import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlackListDto } from './dto/create-black-list.dto';
import { UpdateBlackListDto } from './dto/update-black-list.dto';
import { UserBlackList } from 'src/entities/userBlackList.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlackListService {
  constructor(
    @InjectRepository(UserBlackList)
    private readonly userBlackListRepository: Repository<UserBlackList>,
  ) {}

  async blockUser(blockerId: number, blockedId: number) {
    if (blockerId === blockedId) {
      throw new Error('Không thể tự chặn chính mình');
    }

    // Kiểm tra xem đã có trong danh sách chặn chưa
    const existing = await this.userBlackListRepository.findOne({
      where: {
        blocker: { id: blockerId },
        blocked: { id: blockedId },
      },
      loadRelationIds: true,
    });

    if (existing) {
      throw new Error('Người này đã bị chặn trước đó');
    }

    // Tạo bản ghi mới
    await this.userBlackListRepository.insert({
      blocker: { id: blockerId },
      blocked: { id: blockedId },
    });

    return { message: 'Đã chặn người dùng thành công' };
  }
  
  async unblockUser(blockerId: number, blockedId: number) {
    const existing = await this.userBlackListRepository.findOne({
      where: { blocker: { id: blockerId }, blocked: { id: blockedId } },
      loadRelationIds: true, // chỉ lấy id, không join nặng
    });

    if (!existing) {
      throw new NotFoundException('Người này không nằm trong danh sách chặn.');
    }

    await this.userBlackListRepository.remove(existing);
    return { message: 'Đã gỡ chặn người dùng.' };
  }

  async getBlockedUsers(userId: number) {
    const list = await this.userBlackListRepository.find({
      where: { blocker: { id: userId } },
      relations: ['blocked', 'blocked.profile'], // lấy thông tin user và profile của user bị chặn
    });

    return list.map((entry) => {
      const { blocked } = entry;
      const { profile } = blocked;

      return {
        id: blocked.id,
        email: blocked.email,
        isActivated: blocked.isActivated,
        createdAt: blocked.createdAt,
        name: profile ? profile.name : null,
        urlPublicAvatar: profile ? profile.urlPublicAvatar : null,
        phone: profile ? profile.phone : null,
      };
    });
  }
  
  async isBlockedBetween(userAId: number, userBId: number): Promise<boolean> {
    const record = await this.userBlackListRepository.findOne({
      where: [
        { blocker: { id: userAId }, blocked: { id: userBId } },
        { blocker: { id: userBId }, blocked: { id: userAId } },
      ],
      loadRelationIds: true,
    });

    return !!record; // true nếu có 1 trong 2 chiều chặn
  }
}
