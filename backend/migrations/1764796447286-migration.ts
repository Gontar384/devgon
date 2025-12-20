import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1764796447286 implements MigrationInterface {
  name = 'Migration1764796447286';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN "editable"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content"
      ADD "editable" boolean NOT NULL DEFAULT true`);
  }
}
