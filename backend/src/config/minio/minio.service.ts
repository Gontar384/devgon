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
  private readonly accessKey: string;
  private readonly secretKey: string;

  constructor(private configService: ConfigService) {
    this.bucketName =
      this.configService.get<string>('MINIO_BUCKET_NAME') ?? 'media';
    this.publicUrl = this.configService.get<string>('MINIO_PUBLIC_URL') ?? '';

    this.accessKey = this.configService.get<string>('MINIO_ROOT_USER') ?? '';
    this.secretKey =
      this.configService.get<string>('MINIO_ROOT_PASSWORD') ?? '';

    const endpoint =
      this.configService.get<string>('MINIO_ENDPOINT') ?? 'localhost';
    const port = parseInt(
      this.configService.get<string>('MINIO_PORT') ?? '9000',
      10,
    );
    const useSSL = this.configService.get<string>('MINIO_USE_SSL') === 'true';

    this.minioClient = new Minio.Client({
      endPoint: endpoint,
      port: port,
      useSSL: useSSL,
      accessKey: this.accessKey,
      secretKey: this.secretKey,
      region: 'eu-central-1',
    });

    this.logger.log(
      `🔧 Minio initialized. Internal: ${endpoint}:${port}. Public URL: ${this.publicUrl || 'none'}`,
    );
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
    if (!this.publicUrl) {
      return await this.minioClient.presignedGetObject(
        this.bucketName,
        storageKey,
        expirySeconds,
      );
    }

    const url = new URL(this.publicUrl);
    const publicClient = new Minio.Client({
      endPoint: url.hostname,
      port: url.port
        ? parseInt(url.port, 10)
        : url.protocol === 'https:'
          ? 443
          : 80,
      useSSL: url.protocol === 'https:',
      accessKey: this.accessKey,
      secretKey: this.secretKey,
      region: 'eu-central-1',
    });

    return await publicClient.presignedGetObject(
      this.bucketName,
      storageKey,
      expirySeconds,
    );
  }
}
