import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Profile } from 'src/entities/profile.entity';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>
    ) {}

  async create(userData: any) {
    const newUser = this.userRepository.create({
      email: userData.email,
      password: userData.password,
    });

    const hashedPassword = bcrypt.hashSync(
      userData.password,
      parseInt(process.env.SALT_ROUNDS || '10'),
    );
    newUser.password = hashedPassword;

    await this.userRepository.save(newUser);

    const profile = this.profileRepository.create({
      ...userData,
      user: newUser,
    });
    await this.profileRepository.save(profile);

    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        isActivated: newUser.isActivated,
        createdAt: newUser.createdAt,
      },
      message: 'User created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  async findByEmail(email: string | undefined) {
    const profile = await this.profileRepository.findOne({
      where: { email: email },
      relations: ['user'], // Lấy cả thông tin user liên kết
    });

    if (!profile) return null;

    return {
      ...profile,
      userId: profile.user ? profile.user.id : null,
      isActivated: profile.user ? profile.user.isActivated : null,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  async activateUser(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new HttpException(
        {
          success: false,
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    user.isActivated = true;

    await this.userRepository.update(user.id, user);

    return {
      success: true,
      message: 'User activated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async resetPassword(req: any, passwordData: any) {
    console.log(req.user);
    const userId = req.user.userId;
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException(
        {
          success: false,
          message: 'User not found',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const hashedPassword = await bcrypt.hashSync(
      passwordData.password,
      parseInt(process.env.SALT_ROUNDS || '10'),
    );

    await this.userRepository.update(user.id, {
      password: hashedPassword,
    });

    return {
      success: true,
      message: 'Password reset successfully',
      statusCode: HttpStatus.OK,
    };
  }
  
}
