export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

/**
 * Subset of Multer's file object — contains only the fields
 * used within this application.
 */
export interface UploadedFileType {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface UploadedMediaItem {
  id: string;
  /** Matches the client-generated tempId sent during upload. */
  tempId: string;
  filename: string;
  type: MediaType;
  order: number;
}

export interface UploadMediaResponse {
  success: boolean;
  media: UploadedMediaItem[];
}
