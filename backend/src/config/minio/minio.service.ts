import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { MulterFile } from './minio-types';

/**
 * Service for interacting with MinIO object storage.
 * Initializes the client on startup, ensures the configured bucket exists
 * and exposes it for anonymous read so media can be served under stable URLs.
 */
@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private minioClient: Minio.Client;
  private readonly bucketName: string;
  private readonly publicUrl: string;
  private readonly endpoint: string;
  private readonly port: number;
  private readonly useSSL: boolean;

  constructor(private configService: ConfigService) {
    this.bucketName =
      this.configService.get<string>('MINIO_BUCKET_NAME') ?? 'media';
    this.publicUrl = this.configService.get<string>('MINIO_PUBLIC_URL') ?? '';

    this.endpoint =
      this.configService.get<string>('MINIO_ENDPOINT') ?? 'localhost';
    this.port = parseInt(
      this.configService.get<string>('MINIO_PORT') ?? '9000',
      10,
    );
    this.useSSL = this.configService.get<string>('MINIO_USE_SSL') === 'true';

    this.minioClient = new Minio.Client({
      endPoint: this.endpoint,
      port: this.port,
      useSSL: this.useSSL,
      accessKey: this.configService.get<string>('MINIO_ROOT_USER') ?? '',
      secretKey: this.configService.get<string>('MINIO_ROOT_PASSWORD') ?? '',
      region: 'eu-central-1',
    });

    this.logger.log(
      `🔧 Minio initialized. Internal: ${this.endpoint}:${this.port}. Public URL: ${this.publicUrl || 'none'}`,
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

      await this.applyPublicReadPolicy();
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

  /**
   * Builds a permanent, cacheable URL for an object.
   *
   * Objects are readable anonymously (see `applyPublicReadPolicy`), so no
   * signature is involved — the URL never expires and can be cached by
   * browsers and CDNs, and safely embedded in statically generated pages.
   *
   * MINIO_PUBLIC_URL points at the public-facing address in production,
   * where the internal MinIO endpoint is not reachable by clients.
   */
  getPublicUrl(storageKey: string): string {
    const base =
      this.publicUrl ||
      `${this.useSSL ? 'https' : 'http'}://${this.endpoint}:${this.port}`;

    return `${base.replace(/\/+$/, '')}/${this.bucketName}/${encodeURIComponent(storageKey)}`;
  }

  /**
   * Grants anonymous `GetObject` on the bucket's contents.
   *
   * Listing is deliberately not granted — objects can only be fetched by
   * their exact key, which is a random UUID assigned on upload. The bucket
   * holds public website media only.
   */
  private async applyPublicReadPolicy(): Promise<void> {
    const policy = JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucketName}/*`],
        },
      ],
    });

    await this.minioClient.setBucketPolicy(this.bucketName, policy);
    this.logger.log(`✅ Bucket ${this.bucketName} readable by anonymous GET`);
  }
}
