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

/**
 * REST controller for media file uploads.
 *
 * Provides a single endpoint for uploading files associated with a content block.
 * All routes require an active admin session — protected by `AuthSessionGuard`
 * and `RolesGuard` with `UserRole.ADMIN` applied at the controller level.
 *
 * File uploads are handled via `multipart/form-data` using Multer.
 * Limits: up to 20 files per request, max 50 MB per file.
 *
 * Note: This controller handles only the upload step. The uploaded media
 * is not immediately attached to the content — it is held as a temporary
 * record identified by `tempId` and confirmed during the subsequent
 * GraphQL `updateContent` mutation.
 */
@Controller('media')
@UseGuards(AuthSessionGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * Uploads one or more media files for a given content block.
   *
   * Expects a `multipart/form-data` request with:
   * - `files` — one or more binary file fields
   * - `tempIds` — JSON-serialized array of client-generated temporary IDs,
   *   matched by index to the uploaded files
   *
   * The `tempIds` are used to later reconcile uploaded files with the content
   * update payload sent via GraphQL. Each uploaded file is stored in MinIO
   * and recorded in the database with its `tempId` until the content is saved.
   *
   * @param contentId - ID of the content block the files are being uploaded for
   * @param files - Uploaded files provided by Multer
   * @param tempIdsStr - JSON string representing an array of temporary IDs
   * @returns Upload result containing a success flag and array of uploaded media metadata
   * @throws BadRequestException if `tempIds` cannot be parsed as valid JSON
   */
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
  ): Promise<UploadMediaResponse> {
    let tempIds: string[] = [];
    try {
      tempIds = tempIdsStr
        ? (JSON.parse(tempIdsStr) as unknown as string[])
        : [];
    } catch {
      throw new BadRequestException('Invalid tempIds format');
    }
    const uploadedMedia = await this.mediaService.uploadMany(
      contentId,
      files,
      tempIds,
    );
    return {
      success: true,
      media: uploadedMedia,
    };
  }
}
