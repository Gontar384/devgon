import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private repo: Repository<RefreshToken>,
  ) {}

  async create(data: {
    userId: string;
    token: string;
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<RefreshToken> {
    const refreshToken = this.repo.create(data);
    return this.repo.save(refreshToken);
  }

  async deleteByToken(token: string): Promise<void> {
    await this.repo.delete({ token });
  }

  /**
   * Enforces the per-user device limit by removing oldest refresh tokens.
   * Tokens are ordered by createdAt DESC — excess tokens from the end are deleted.
   * Called before issuing a new refresh token in `setAuthCookies`.
   */
  async enforceMaxTokensPerUser(
    userId: string,
    maxTokens: number = 3,
  ): Promise<void> {
    const tokens = await this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    if (tokens.length >= maxTokens) {
      const tokensToDelete = tokens.slice(maxTokens - 1);
      if (tokensToDelete.length > 0) {
        await this.repo.remove(tokensToDelete);
      }
    }
  }

  /**
   * Atomically deletes a refresh token and returns its data in one query.
   * Used during token rotation to prevent race conditions — the token
   * cannot be reused even if the subsequent insert fails.
   */
  async deleteByTokenReturning(token: string): Promise<RefreshToken | null> {
    const deletedToken = await this.repo
      .createQueryBuilder()
      .delete()
      .from(RefreshToken)
      .where('token = :token', { token })
      .returning(['userId', 'expiresAt', 'userAgent', 'ipAddress'])
      .execute();

    return (deletedToken.raw as RefreshToken[])[0] ?? null;
  }
}
