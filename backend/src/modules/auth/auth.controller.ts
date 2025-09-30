import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './auth.types';
import { JwtPayload } from './auth.types';
import { UserResponseDto } from '../user/read-user.dto';
import { JwtAuthGuard } from './jwt.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('verify')
  verifyAuth(@Req() req: RequestWithUser): UserResponseDto {
    const user = req.user as JwtPayload;
    return { userId: user.userId, email: user.email, role: user.role };
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh')
  refresh(@Req() req: RequestWithUser, @Res() res: Response) {
    const user = req.user as JwtPayload;
    this.authService.refreshJwtCookie(user, res);
    return res.status(200).json({ message: 'Token refreshed' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Res() res: Response) {
    this.authService.logout(res);
    return res.status(200).json({ message: 'Logged out' });
  }
}
