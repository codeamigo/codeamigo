import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveOriginalStepIdAddPosition1682346803877 implements MigrationInterface {
    name = 'RemoveOriginalStepIdAddPosition1682346803877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "step" RENAME COLUMN "originalStepId" TO "position"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "step" RENAME COLUMN "position" TO "originalStepId"`);
    }

}
