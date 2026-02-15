import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { RolesGuard } from './roles.guard';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './oauth.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { RefreshTokenRepository } from './refresh-token.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './refresh-token.entity';
import { AUTH_POLICY } from './auth.policy';
import { AuthSessionGuard } from './auth-session.guard';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: AUTH_POLICY.tokens.access.jwtExpiry },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    RolesGuard,
    RefreshTokenRepository,
    AuthSessionGuard,
  ],
  exports: [RolesGuard, AuthSessionGuard, JwtModule, AuthService],
})
export class AuthModule {}
