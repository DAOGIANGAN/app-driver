// filepath: e:\AppDriver\app-driver\src\modules\profile\profile.controller.ts
import { Controller, Post, Get, Body, UseGuards, Request, Param, Query, ParseIntPipe } from '@nestjs/common';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';
import { Profile } from 'src/entities/profile.entity';

@UseGuards(JwtAccessAuthGuard)
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // Tạo hoặc cập nhật profile của chính mình
  @Post()
  @UseGuards(JwtAccessAuthGuard)
  createOrUpdateProfile(@Request() req, @Body() data: Partial<Profile>) {
    return this.profileService.createOrUpdateProfile(req.user.id, data);
  }

  // Tìm kiếm người dùng theo tên
  @Get('search')
  @UseGuards(JwtAccessAuthGuard)
  searchProfiles(@Query('username') username: string) {
    console.log('Searching profiles with username:', username);
    return this.profileService.searchProfilesByUserName(username);
  }

  // Xem profile của người khác
  @Get(':userId')
  @UseGuards(JwtAccessAuthGuard) 
  getProfileByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.profileService.getProfileByUserId(userId);
  }

}