import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToMany,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Media } from './media/media.entity';

/**
 * Represents a CMS content block assigned to a named page section.
 *
 * Multiple blocks can share the same `key` and are displayed in ascending `order`.
 * Deleting a Content record cascades to all associated Media records.
 */
@Entity({ name: 'content' })
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  key: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  title?: string | null;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  header?: string | null;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @OneToMany(() => Media, (media) => media.content, { cascade: true })
  media: Media[];

  @Column({ type: 'integer', default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
