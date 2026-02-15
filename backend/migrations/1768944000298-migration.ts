import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1768944000298 implements MigrationInterface {
  name = 'Migration1768944000298';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN "images"`);
    await queryRunner.query(`ALTER TABLE "content"
      ADD "images" text array`);
    await queryRunner.query(`ALTER TABLE "content"
      ALTER COLUMN "order" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content"
      ALTER COLUMN "order" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN "images"`);
    await queryRunner.query(`ALTER TABLE "content"
      ADD "images" text`);
  }
}
