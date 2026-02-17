import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1771371536794 implements MigrationInterface {
  name = 'Migration1771371536794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" TYPE varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "username" TYPE varchar(100)`,
    );

    await queryRunner.query(`ALTER TABLE "user"
      ALTER COLUMN "email" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user"
      ALTER COLUMN "username" SET NOT NULL`);

    await queryRunner.query(
      `ALTER TABLE "media" ALTER COLUMN "filename" TYPE varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ALTER COLUMN "storageKey" TYPE varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ALTER COLUMN "mimeType" TYPE varchar(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ALTER COLUMN "uploadTempId" TYPE varchar(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ALTER COLUMN "alt" TYPE varchar(255)`,
    );

    await queryRunner.query(`ALTER TABLE "media"
      ALTER COLUMN "filename" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "media"
      ALTER COLUMN "storageKey" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "media"
      ALTER COLUMN "mimeType" SET NOT NULL`);

    await queryRunner.query(
      `ALTER TABLE "content" ALTER COLUMN "key" TYPE varchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "content" ALTER COLUMN "title" TYPE varchar(1000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "content" ALTER COLUMN "header" TYPE varchar(1000)`,
    );
    await queryRunner.query(
      `ALTER TABLE "content" ALTER COLUMN "description" TYPE text`,
    );
    await queryRunner.query(`ALTER TABLE "content"
      ALTER COLUMN "order" SET DEFAULT '0'`);

    await queryRunner.query(
      `CREATE INDEX "IDX_5739240fe9e0a7b81d8b99cf17" ON "content" ("key")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5739240fe9e0a7b81d8b99cf17"`,
    );
    await queryRunner.query(`ALTER TABLE "content"
      ALTER COLUMN "order" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "content" ALTER COLUMN "description" TYPE character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "content" ALTER COLUMN "header" TYPE character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "content" ALTER COLUMN "title" TYPE character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "content" ALTER COLUMN "key" TYPE character varying`,
    );

    await queryRunner.query(
      `ALTER TABLE "media" ALTER COLUMN "alt" TYPE character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ALTER COLUMN "uploadTempId" TYPE character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ALTER COLUMN "mimeType" TYPE character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ALTER COLUMN "storageKey" TYPE character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ALTER COLUMN "filename" TYPE character varying`,
    );

    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "username" TYPE character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "email" TYPE character varying`,
    );
  }
}
