import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './jwt.guard';
import { AuthController } from './auth.controller';
import { RolesGuard } from './roles.guard';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './oauth.strategy';
import { UserModule } from '../user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

console.log(process.env.JWT_SECRET_KEY);

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtGuard, RolesGuard, AuthService, GoogleStrategy],
  exports: [JwtGuard, RolesGuard],
})
export class AuthModule {}
