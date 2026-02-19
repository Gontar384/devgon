import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1771459090729 implements MigrationInterface {
  name = 'Migration1771459090729';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" RENAME TO "refresh_token"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_token" RENAME TO "refresh_tokens"`,
    );
  }
}
