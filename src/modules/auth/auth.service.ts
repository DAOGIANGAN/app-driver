import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ref } from 'process';
import { RefreshTokenService } from '../refresh_token/refresh_token.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private refreshTokenService: RefreshTokenService,
        private jwtService: JwtService,
    ) {}

    async login(req: any) {
        // const payload = { email: req.user.email, sub: req.user.id };
        // const now = new Date();
        // return {
        //     access_token: this.jwtService.sign(payload),
        //     refresh_token: this.jwtService.sign({ ...payload, createdAt: now.toISOString() }, { expiresIn: '30d' })
        // };
        const { access_token, refresh_token } =
        await this.refreshTokenService.createTokenWhenLogin(req);

        return {
            access_token,
            refresh_token,
        };
    }

    async isLoggedIn(req: any) {
    const payload = req.user;
    const refreshToken = req.headers['authorization']?.split(' ')[1];
    const result = await this.refreshTokenService.validateRefreshToken(
      payload,
      refreshToken,
    );

    if (result) {
      return {
        isLoggedIn: true,
      };
    }

    return {
      isLoggedIn: false,
    };
  }
}
