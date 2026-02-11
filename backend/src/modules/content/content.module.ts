import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';
import { Content } from './content.entity';
import { AuthModule } from '../auth/auth.module';
import { MinioService } from '../../config/minio/minio.service';
import { Media } from './media/media.entity';
import { MediaController } from './media/media.controller';
import { MediaService } from './media/media.service';

@Module({
  imports: [TypeOrmModule.forFeature([Content, Media]), AuthModule],
  controllers: [MediaController],
  providers: [ContentService, ContentResolver, MediaService, MinioService],
})
export class ContentModule {}
