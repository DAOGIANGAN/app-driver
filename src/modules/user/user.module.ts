import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { Profile } from 'src/entities/profile.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User, Profile])],
})
export class UserModule {}
