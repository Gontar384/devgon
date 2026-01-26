import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './auth.types';
import { UserResponseDto } from '../user/read-user.dto';
import { JwtAuthGuard } from './jwt.guard';
import { AUTH_POLICY } from './auth.policy';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('oauth')
  @UseGuards(AuthGuard('google'))
  oauthLogin() {}

  @Get('oauth/callback')
  @UseGuards(AuthGuard('google'))
  async oauthCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    const user = req.user;

    await this.authService.setAuthCookies(user, res, req);

    return res.redirect(`${process.env.FRONTEND_URL}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verifyAuth(@Req() req: RequestWithUser): UserResponseDto {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const user = req.user;
    return {
      userId: user.userId,
      email: user.email,
      role: user.role,
    };
  }

  @Post('refresh')
  async refresh(@Req() req: RequestWithUser, @Res() res: Response) {
    const refreshToken = req.cookies[
      AUTH_POLICY.cookies.refresh.name
    ] as unknown;

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedException('No refresh token provided');
    }

    try {
      const user = await this.authService.refreshAccessToken(
        refreshToken,
        res,
        req,
      );

      return res.status(200).json({
        message: 'Tokens refreshed successfully',
        user: {
          userId: user.userId,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return res.status(401).json({
          error: error.message,
        });
      }
      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  }

  @Post('logout')
  async logout(@Req() req: RequestWithUser, @Res() res: Response) {
    const token = req.cookies[AUTH_POLICY.cookies.refresh.name] as unknown;
    const refreshToken = typeof token === 'string' ? token : undefined;

    await this.authService.logout(refreshToken, res);

    return res.status(200).json({
      message: 'Logged out successfully',
    });
  }
}
