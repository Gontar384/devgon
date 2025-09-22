import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';
import { Content } from './content.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Content]), AuthModule],
  providers: [ContentService, ContentResolver],
  exports: [ContentService],
})
export class ContentModule {}
