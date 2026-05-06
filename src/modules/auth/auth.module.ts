import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/passport/local.strategy';
import { JwtAccessStrategy, JwtRefreshStrategy } from 'src/passport/jwt.strategy';
import { OTPService } from './otp.service';
import { RedisModule } from 'src/redis/redis.module';
import { RefreshTokenModule } from '../refresh_token/refresh_token.module';

@Module({
    imports: [
        UserModule,
        PassportModule,
        RefreshTokenModule,
        RedisModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'UbQ7ssdfasdgfh32gsfvvYU',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService, 
        OTPService, 
        LocalStrategy, 
        JwtAccessStrategy, 
        JwtRefreshStrategy
    ],
    exports: [AuthService, OTPService],
})
export class AuthModule {}
