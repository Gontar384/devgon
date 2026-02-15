import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1769349686626 implements MigrationInterface {
  name = 'Migration1769349686626';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "refresh_tokens"
                             (
                               "id"        uuid                   NOT NULL DEFAULT uuid_generate_v4(),
                               "userId"    uuid                   NOT NULL,
                               "token"     character varying(128) NOT NULL,
                               "expiresAt" TIMESTAMP              NOT NULL,
                               "createdAt" TIMESTAMP              NOT NULL DEFAULT now(),
                               "userAgent" character varying(500),
                               "ipAddress" character varying(45),
                               CONSTRAINT "UQ_4542dd2f38a61354a040ba9fd57" UNIQUE ("token"),
                               CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_ec511b89bba27b211e32a2a12f" ON "refresh_tokens" ("userId", "expiresAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4542dd2f38a61354a040ba9fd5" ON "refresh_tokens" ("token") `,
    );
    await queryRunner.query(`ALTER TABLE "refresh_tokens"
      ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4542dd2f38a61354a040ba9fd5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ec511b89bba27b211e32a2a12f"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
  }
}
