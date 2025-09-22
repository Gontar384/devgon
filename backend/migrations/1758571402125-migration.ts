import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1758571402125 implements MigrationInterface {
  name = 'Migration1758571402125';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('guest', 'user', 'admin')`,
    );
    await queryRunner.query(`CREATE TABLE "user"
                             (
                               "id"        uuid                      NOT NULL DEFAULT uuid_generate_v4(),
                               "email"     character varying         NOT NULL,
                               "username"  character varying         NOT NULL,
                               "role"      "public"."user_role_enum" NOT NULL DEFAULT 'user',
                               "createdAt" TIMESTAMP                 NOT NULL DEFAULT now(),
                               CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                               CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
                               CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE TABLE "content"
                             (
                               "id"          uuid              NOT NULL DEFAULT uuid_generate_v4(),
                               "key"         character varying NOT NULL,
                               "title"       character varying,
                               "description" character varying,
                               "editable"    boolean           NOT NULL DEFAULT true,
                               "createdAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                               "updatedAt"   TIMESTAMP         NOT NULL DEFAULT now(),
                               CONSTRAINT "PK_6a2083913f3647b44f205204e36" PRIMARY KEY ("id")
                             )`);
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
    await queryRunner.query(`DROP TABLE "content"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
  }
}
