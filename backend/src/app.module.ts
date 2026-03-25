import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfigModule } from './config/typeorm/typeorm.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ContentModule } from './modules/cms/content/content.module';
import { GraphqlConfigModule } from './config/graphql/graphql.module';
import { HealthModule } from '../test/healthcheck/health.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmConfigModule,
    AuthModule,
    UserModule,
    ContentModule,
    GraphqlConfigModule,
    HealthModule,
    ContactModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('SMTP_HOST'),
          port: Number(config.get('SMTP_PORT')),
          secure: false,
          auth: {
            user: config.get('SMTP_USER'),
            pass: config.get('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"devgon" <${config.get('SMTP_FROM')}>`,
        },
      }),
    }),
  ],
})
export class AppModule {}
