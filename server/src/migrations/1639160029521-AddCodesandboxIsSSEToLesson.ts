import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCodesandboxIsSSEToLesson1639160029521 implements MigrationInterface {
    name = 'AddCodesandboxIsSSEToLesson1639160029521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" ADD "isSandboxSSE" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "isSandboxSSE"`);
    }

}
