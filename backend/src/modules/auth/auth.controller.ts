import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './auth.types';
import { JwtPayload } from './auth.types';
import { JwtGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('oauth')
  @UseGuards(AuthGuard('google'))
  oauthLogin() {}

  @Get('oauth/callback')
  @UseGuards(AuthGuard('google'))
  oauthCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const user: JwtPayload = req.user as JwtPayload;
    this.authService.setJwtCookie(user, res);
    return res.redirect(`${process.env.FRONTEND_URL}`);
  }

  @UseGuards(JwtGuard)
  @Get('verify')
  verifyAuth(@Req() req: RequestWithUser) {
    const user = req.user as JwtPayload;
    return { userId: user.userId, email: user.email, role: user.role };
  }

  @UseGuards(JwtGuard)
  @Get('logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
