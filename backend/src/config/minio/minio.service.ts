import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { MulterFile } from './minio-types';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private readonly bucketName: string;
  private readonly publicUrl: string;

  constructor(private configService: ConfigService) {
    this.bucketName =
      this.configService.get<string>('MINIO_BUCKET_NAME') ?? 'media';

    const endpoint =
      this.configService.get<string>('MINIO_ENDPOINT') ?? 'localhost';
    const port = parseInt(
      this.configService.get<string>('MINIO_PORT') ?? '9000',
      10,
    );
    const useSSL = this.configService.get<string>('MINIO_USE_SSL') === 'true';
    this.logger.log(
      `🔧 Connecting to Minio at ${endpoint}:${port} (SSL: ${useSSL})`,
    );

    this.publicUrl = this.configService.get<string>('MINIO_PUBLIC_URL') ?? '';

    if (this.publicUrl) {
      this.logger.log(`🌐 Public Minio URL: ${this.publicUrl}`);
    }

    this.minioClient = new Minio.Client({
      endPoint: endpoint,
      port: port,
      useSSL: useSSL,
      accessKey: this.configService.get<string>('MINIO_ROOT_USER') ?? '',
      secretKey: this.configService.get<string>('MINIO_ROOT_PASSWORD') ?? '',
    });
  }

  async onModuleInit() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'eu-central-1');
        this.logger.log(`✅ Bucket ${this.bucketName} created`);
      } else {
        this.logger.log(`✅ Bucket ${this.bucketName} already exists`);
      }
    } catch (error) {
      this.logger.error('❌ Error initializing Minio:', error);
      throw error;
    }
  }

  async uploadFile(file: MulterFile, storageKey: string): Promise<string> {
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Original-Name': file.originalname,
    };

    await this.minioClient.putObject(
      this.bucketName,
      storageKey,
      file.buffer,
      file.size,
      metaData,
    );

    return storageKey;
  }

  async deleteFile(storageKey: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, storageKey);
  }

  async getSignedUrl(
    storageKey: string,
    expirySeconds = 3600,
  ): Promise<string> {
    const signedUrl = await this.minioClient.presignedGetObject(
      this.bucketName,
      storageKey,
      expirySeconds,
    );

    if (this.publicUrl) {
      try {
        const url = new URL(signedUrl);
        const publicUrlObj = new URL(this.publicUrl);

        url.protocol = publicUrlObj.protocol;
        url.hostname = publicUrlObj.hostname;
        url.port = publicUrlObj.port || '';

        const transformedUrl = url.toString();
        this.logger.debug(`🔗 Transformed URL: ${transformedUrl}`);

        return transformedUrl;
      } catch (error) {
        this.logger.error('❌ Error transforming URL:', error);
        return signedUrl;
      }
    }

    return signedUrl;
  }
}
