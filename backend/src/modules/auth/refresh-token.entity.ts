import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../user/user.entity';

/**
 * Persisted refresh token record. Each record represents one active session.
 * Token rotation replaces the record on every refresh — old token is deleted
 * atomically before the new one is inserted.
 */
@Entity('refresh_token')
@Index(['token'])
@Index(['userId', 'expiresAt'])
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  /** Raw token value — 128-char hex string, unique across all users. */
  @Column({ type: 'varchar', length: 128, unique: true })
  token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  /** Stored for auditing and device management — not used for auth decisions. */
  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent?: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress?: string;
}
