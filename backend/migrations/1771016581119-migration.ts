import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1771016581119 implements MigrationInterface {
    name = 'Migration1771016581119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" ADD "uploadTempId" character varying`);
        await queryRunner.query(`ALTER TABLE "media" ADD CONSTRAINT "UQ_4063fcbc9db3dbf49ab1a1d1320" UNIQUE ("uploadTempId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP CONSTRAINT "UQ_4063fcbc9db3dbf49ab1a1d1320"`);
        await queryRunner.query(`ALTER TABLE "media" DROP COLUMN "uploadTempId"`);
    }

}
