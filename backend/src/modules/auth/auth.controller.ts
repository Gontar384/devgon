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
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './auth.types';
import { UserResponseDto } from '../user/read-user.dto';
import { AUTH_POLICY } from './auth.policy';
import { AuthSessionGuard } from './auth-session.guard';

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

  @UseGuards(AuthSessionGuard)
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

  @Get('me')
  async getCurrentUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDto> {
    return await this.authService.getCurrentUser(req, res);
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
