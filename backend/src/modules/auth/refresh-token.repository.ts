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

  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.repo.findOne({
      where: { token },
      relations: ['user'],
    });
  }

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
}
