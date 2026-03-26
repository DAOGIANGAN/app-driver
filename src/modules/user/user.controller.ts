import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';
import { ConfirmPasswordGuard } from 'src/guards/confirm-password.guard';
import { PasswordDto } from './dto/password.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('register')
    async createUser(@Body() userData: any) {
        return this.userService.create(userData);
    }

    @UseGuards(ConfirmPasswordGuard)
    @UseGuards(JwtAccessAuthGuard)
    @Post('reset-password')
    async resetPassword(@Req() req, @Body() data: PasswordDto) {
        return await this.userService.resetPassword(req, data);
    }
}
