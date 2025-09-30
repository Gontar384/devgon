import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1759265617986 implements MigrationInterface {
  name = 'Migration1759265617986';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content"
      ADD "images" text`);
    await queryRunner.query(`ALTER TABLE "content"
      ADD "video" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN "video"`);
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN "images"`);
  }
}
