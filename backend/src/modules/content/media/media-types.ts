import { MediaType } from './media.entity';

export interface UploadedFileType {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface UploadMediaResponse {
  success: boolean;
  media: Array<{
    id: string;
    filename: string;
    type: MediaType;
    order: number;
  }>;
}