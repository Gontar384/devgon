import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'content' })
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  header?: string;

  @Column({ nullable: true })
  description?: string;

  @Column('simple-array', { nullable: true })
  images?: string[];

  @Column({ nullable: true })
  video?: string;

  @Column({ default: 0, nullable: true })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
