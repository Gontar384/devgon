import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Content } from '../content.entity';
import { MediaType } from './media-types';

/**
 * Represents a media file (image or video) attached to a Content block.
 * The physical file is stored in MinIO, referenced by `storageKey`.
 * Deletion of the parent Content cascades to all related Media records.
 */
@Entity({ name: 'media' })
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  /** Unique key used to identify the file in MinIO object storage. */
  @Column({ type: 'varchar', unique: true, length: 255 })
  storageKey: string;

  /**
   * Temporary client-generated ID assigned during upload.
   * Used to match uploaded files to their position in a pending content update.
   * Cleared to `null` after the content is successfully saved.
   */
  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  uploadTempId?: string | null;

  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ type: 'enum', enum: MediaType })
  type: MediaType;

  @Column({ type: 'integer' })
  size: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  alt?: string | null;

  @Column({ type: 'integer', default: 0 })
  order: number;

  @ManyToOne(() => Content, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contentId' })
  content: Content;

  @Column({ type: 'uuid' })
  contentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
