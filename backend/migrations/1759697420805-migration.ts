import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759697420805 implements MigrationInterface {
  name = 'Migration1759697420805';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content"
      ADD "header" character varying`);
    await queryRunner.query(`ALTER TABLE "content"
      ADD "order" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN "order"`);
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN "header"`);
  }
}
