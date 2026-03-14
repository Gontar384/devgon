import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1773400154023 implements MigrationInterface {
  name = 'Migration1773400154023';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content" RENAME COLUMN "data" TO "customData"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content" RENAME COLUMN "customData" TO "data"`,
    );
  }
}
