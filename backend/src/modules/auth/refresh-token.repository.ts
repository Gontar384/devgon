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
