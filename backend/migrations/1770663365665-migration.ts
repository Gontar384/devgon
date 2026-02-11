import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1770663365665 implements MigrationInterface {
  name = 'Migration1770663365665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."media_type_enum" AS ENUM('image', 'video')`,
    );
    await queryRunner.query(`CREATE TABLE "media"
                             (
                               "id"         uuid                       NOT NULL DEFAULT uuid_generate_v4(),
                               "filename"   character varying          NOT NULL,
                               "storageKey" character varying          NOT NULL,
                               "mimeType"   character varying          NOT NULL,
                               "type"       "public"."media_type_enum" NOT NULL,
                               "size"       integer                    NOT NULL,
                               "alt"        character varying,
                               "order"      integer                    NOT NULL DEFAULT '0',
                               "contentId"  uuid                       NOT NULL,
                               "createdAt"  TIMESTAMP                  NOT NULL DEFAULT now(),
                               "updatedAt"  TIMESTAMP                  NOT NULL DEFAULT now(),
                               CONSTRAINT "UQ_b610a22e5ce5597e88a8d9c9b2a" UNIQUE ("storageKey"),
                               CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN "video"`);
    await queryRunner.query(`ALTER TABLE "content" DROP COLUMN "images"`);
    await queryRunner.query(`ALTER TABLE "media"
      ADD CONSTRAINT "FK_3c2eb07640ceaeaed140a200cc5" FOREIGN KEY ("contentId") REFERENCES "content" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "media" DROP CONSTRAINT "FK_3c2eb07640ceaeaed140a200cc5"`,
    );
    await queryRunner.query(`ALTER TABLE "content"
      ADD "images" text array`);
    await queryRunner.query(`ALTER TABLE "content"
      ADD "video" character varying`);
    await queryRunner.query(`DROP TABLE "media"`);
    await queryRunner.query(`DROP TYPE "public"."media_type_enum"`);
  }
}
