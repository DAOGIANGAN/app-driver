import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CheckUniqueEmailGuard } from 'src/guards/check-unique-email.guard';
import { ConfirmPasswordGuard } from 'src/guards/confirm-password.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { JwtAccessAuthGuard, JwtRefreshAuthGuard } from 'src/guards/jwt-auth.guard';
import { OTPService } from './otp.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private otpService: OTPService,
    ) {}

    @UseGuards(ConfirmPasswordGuard)
    @UseGuards(CheckUniqueEmailGuard)
    @Post('register')
    async register(@Body() userData: any) {
        return this.userService.create(userData);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any) {
        return this.authService.login(req);
    }

    @UseGuards(JwtAccessAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        return await this.userService.findByEmail(req.user.email);
    }

    @Get('get-otp-mail-for-register')
    async getOTPMailForRegister(@Request() req, @Query() query) {
        return this.otpService.getOTPMailForRegister(req, query);
    }

    @Post('verify-otp-mail-for-register')
    async verifyOTPMailForRegister(@Request() req) {
        return this.otpService.verifyOTPMailForRegister(req);
    }

    @Get('get-otp-mail-for-forgot-password')
    async getOTPMailForForgotPassword(@Request() req, @Query() query) {
        return this.otpService.getOTPMailForForgotPassword(req, query);
    }

    @Post('verify-otp-mail-for-forgot-password')
    async verifyOTPMailForForgotPassword(@Request() req) {
        return this.otpService.verifyOTPMailForForgotPassword(req);
    }

    @UseGuards(JwtRefreshAuthGuard)
    @Get('is-logged-in')
    async isLoggedIn(@Request() req) {
        return this.authService.isLoggedIn(req);
    }
}
