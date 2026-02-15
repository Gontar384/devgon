import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1768948419766 implements MigrationInterface {
  name = 'Migration1768948419766';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content"
      ALTER COLUMN "order" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "content"
        ALTER COLUMN "order" SET DEFAULT '0'`,
    );
  }
}
