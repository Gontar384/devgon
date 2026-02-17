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

@Entity({ name: 'media' })
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'varchar', unique: true, length: 255 })
  storageKey: string;

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
