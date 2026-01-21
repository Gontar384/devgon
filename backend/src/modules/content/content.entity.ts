import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column('text', { array: true, nullable: true })
  images?: string[] | null;

  @Column({ type: 'varchar', nullable: true })
  video?: string | null;

  @Column({ type: 'integer' })
  order: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
