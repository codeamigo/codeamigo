import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeDefaultTheme1635626611478 implements MigrationInterface {
    name = 'ChangeDefaultTheme1635626611478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "user"."theme" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "theme" SET DEFAULT 'Cobalt'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "theme" SET DEFAULT 'IDLE'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."theme" IS NULL`);
    }

}
