import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Media } from './media/media.entity';

@Entity({ name: 'content' })
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  key: string;

  @Column({ type: 'varchar', nullable: true })
  title?: string | null;

  @Column({ type: 'varchar', nullable: true })
  header?: string | null;

  @Column({ type: 'varchar', nullable: true })
  description?: string | null;

  @OneToMany(() => Media, (media) => media.content, { cascade: true })
  media: Media[];

  @Column({ type: 'integer' })
  order: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
