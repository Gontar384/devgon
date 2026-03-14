import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1773396923145 implements MigrationInterface {
  name = 'Migration1773396923145';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN "header"`);
    await queryRunner.query(`ALTER TABLE "content"
            ADD "subtitle" character varying(1000)`);
    await queryRunner.query(`ALTER TABLE "content"
            ADD "data" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN "data"`);
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN "subtitle"`);
    await queryRunner.query(
      `ALTER TABLE "content"
                ADD "header" character varying(1000)`,
    );
  }
}
