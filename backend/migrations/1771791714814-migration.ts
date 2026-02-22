import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1771791714814 implements MigrationInterface {
  name = 'Migration1771791714814';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ec511b89bba27b211e32a2a12f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4542dd2f38a61354a040ba9fd5"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_324a4286bc04ba74871a9c9a17" ON "refresh_token" ("userId", "expiresAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c31d0a2f38e6e99110df62ab0a" ON "refresh_token" ("token") `,
    );
    await queryRunner.query(`ALTER TABLE "refresh_token"
      ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

    await queryRunner.query(`DROP TABLE "product"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c31d0a2f38e6e99110df62ab0a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_324a4286bc04ba74871a9c9a17"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4542dd2f38a61354a040ba9fd5" ON "refresh_token" ("token") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ec511b89bba27b211e32a2a12f" ON "refresh_token" ("expiresAt", "userId") `,
    );
    await queryRunner.query(`ALTER TABLE "refresh_token"
      ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);

    await queryRunner.query(`
      CREATE TABLE "product"
      (
        "id"   uuid PRIMARY KEY,
        "name" varchar(255) NOT NULL
      )
    `);
  }
}
