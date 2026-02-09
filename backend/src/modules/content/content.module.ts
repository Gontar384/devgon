import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';
import { Content } from './content.entity';
import { AuthModule } from '../auth/auth.module';
import { MinioService } from '../../config/minio/minio.service';
import { Media } from './media/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content, Media]), AuthModule],
  providers: [ContentService, ContentResolver, MinioService],
})
export class ContentModule {}
