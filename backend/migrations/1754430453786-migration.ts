import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1754430453786 implements MigrationInterface {
  name = 'Migration1754430453786';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product"
      DROP COLUMN "updatedAt"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product"
        ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }
}
