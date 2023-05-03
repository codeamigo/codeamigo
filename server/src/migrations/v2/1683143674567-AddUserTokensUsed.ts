import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserTokensUsed1683143674567 implements MigrationInterface {
    name = 'AddUserTokensUsed1683143674567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "tokensUsed" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tokensUsed"`);
    }

}
