import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1755124766412 implements MigrationInterface {
  name = 'Migration1755124766412';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "product"
                             (
                               "id"          uuid              NOT NULL DEFAULT uuid_generate_v4(),
                               "title"       character varying NOT NULL,
                               "description" character varying,
                               "createdAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                               CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
                             )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
