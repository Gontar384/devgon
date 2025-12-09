import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1765302895535 implements MigrationInterface {
    name = 'Migration1765302895535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content" DROP COLUMN "createdAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "content" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
