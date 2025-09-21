import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content.service';
import { ContentResolver } from './content.resolver';
import { Content } from './content.model';

@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  providers: [ContentService, ContentResolver],
  exports: [ContentService],
})
export class ContentModule {}
