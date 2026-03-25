import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1774468689996 implements MigrationInterface {
  name = 'Migration1774468689996';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "contact_message"
                             (
                               "id"        uuid                   NOT NULL DEFAULT uuid_generate_v4(),
                               "firstName" character varying(255) NOT NULL,
                               "lastName"  character varying(255) NOT NULL,
                               "email"     character varying(255) NOT NULL,
                               "phone"     character varying(255),
                               "message"   text                   NOT NULL,
                               "ipAddress" character varying(255) NOT NULL,
                               "createdAt" TIMESTAMP              NOT NULL DEFAULT now(),
                               CONSTRAINT "PK_1476ca9a6265a586f618ea918fd" PRIMARY KEY ("id")
                             )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "contact_message"`);
  }
}
