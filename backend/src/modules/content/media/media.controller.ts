import {
  Controller,
  Post,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFiles,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthSessionGuard } from '../../auth/auth-session.guard';
import { RolesGuard, Roles } from '../../auth/roles.guard';
import { UserRole } from '../../auth/auth.types';
import { MediaService } from './media.service';
import { UploadedFileType, UploadMediaResponse } from './media-types';

@Controller('media')
@UseGuards(AuthSessionGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload/:contentId')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async uploadMedia(
    @Param('contentId') contentId: string,
    @UploadedFiles() files: UploadedFileType[],
    @Body('tempIds') tempIdsStr: string,
    @Body('maxMedia') maxMediaStr?: string,
  ): Promise<UploadMediaResponse> {
    let tempIds: string[] = [];
    try {
      tempIds = tempIdsStr
        ? (JSON.parse(tempIdsStr) as unknown as string[])
        : [];
    } catch {
      throw new BadRequestException('Invalid tempIds format');
    }
    const maxMedia = maxMediaStr ? parseInt(maxMediaStr, 10) : undefined;
    const uploadedMedia = await this.mediaService.uploadMany(
      contentId,
      files,
      tempIds,
      maxMedia,
    );
    return {
      success: true,
      media: uploadedMedia,
    };
  }
}
