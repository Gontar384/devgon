export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface UploadedFileType {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface UploadedMediaItem {
  id: string;
  tempId: string;
  filename: string;
  type: MediaType;
  order: number;
}

export interface UploadMediaResponse {
  success: boolean;
  media: UploadedMediaItem[];
}
