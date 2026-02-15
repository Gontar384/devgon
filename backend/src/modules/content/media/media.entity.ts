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

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity({ name: 'media' })
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  filename: string;

  @Column({ type: 'varchar', unique: true })
  storageKey: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  uploadTempId?: string | null;

  @Column({ type: 'varchar' })
  mimeType: string;

  @Column({ type: 'enum', enum: MediaType })
  type: MediaType;

  @Column({ type: 'integer' })
  size: number;

  @Column({ type: 'varchar', nullable: true })
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
