// filepath: e:\AppDriver\app-driver\src\modules\profile\profile.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { User } from 'src/entities/user.entity';
import { Repository, ILike } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createOrUpdateProfile(userId: number, data: Partial<Profile>) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.profile) {
      // Cập nhật profile đã có
      Object.assign(user.profile, data);
      return this.profileRepository.save(user.profile);
    } else {
      // Tạo profile mới
      const newProfile = this.profileRepository.create({ ...data, user });
      return this.profileRepository.save(newProfile);
    }
  }

  async getProfileByUserId(userId: number) {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException('Profile not found for this user.');
    }
    return {
      ...profile,
      userId: profile.user ? profile.user.id : null,
      isActivated: profile.user ? profile.user.isActivated : null,
    };
  }

  async searchProfilesByUserName(username: string) {
    return this.profileRepository.find({
      where: {
          username: ILike(`${username}%`),
      },
      relations: ['user'], // Lấy cả thông tin user liên quan
    });
  }
}