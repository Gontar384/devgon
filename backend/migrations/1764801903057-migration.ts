import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1764801903057 implements MigrationInterface {
  name = 'Migration1764801903057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content"
      ALTER COLUMN "order" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "content"
      ALTER COLUMN "order" SET NOT NULL`);
  }
}
