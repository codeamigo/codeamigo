import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeEmailNotUnique1683208623365 implements MigrationInterface {
    name = 'MakeEmailNotUnique1683208623365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "user"."email" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."email" IS NULL`);
    }

}
