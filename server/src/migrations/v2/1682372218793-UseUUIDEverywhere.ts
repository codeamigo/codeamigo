import {MigrationInterface, QueryRunner} from "typeorm";

export class UseUUIDEverywhere1682372218793 implements MigrationInterface {
    name = 'UseUUIDEverywhere1682372218793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP CONSTRAINT "FK_54b53238a8279826f95be669f8d"`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" DROP CONSTRAINT "FK_9b085ea6f0570114685cedab8a3"`);
        await queryRunner.query(`ALTER TABLE "code_module" DROP CONSTRAINT "FK_3126c366bff35466d2fd0969286"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "code_module" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "code_module" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP CONSTRAINT "PK_fea86db187949398f8b614f730a"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD CONSTRAINT "PK_fea86db187949398f8b614f730a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" DROP CONSTRAINT "PK_8b171f8975ffec63c490938a83c"`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" ADD CONSTRAINT "PK_5fea17f3ea912b2cafbb1e65f60" PRIMARY KEY ("lessonId")`);
        await queryRunner.query(`DROP INDEX "IDX_9b085ea6f0570114685cedab8a"`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" DROP CONSTRAINT "PK_5fea17f3ea912b2cafbb1e65f60"`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" ADD CONSTRAINT "PK_8b171f8975ffec63c490938a83c" PRIMARY KEY ("lessonId", "userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_9b085ea6f0570114685cedab8a" ON "lesson_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "code_module" ADD CONSTRAINT "FK_3126c366bff35466d2fd0969286" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD CONSTRAINT "FK_54b53238a8279826f95be669f8d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" ADD CONSTRAINT "FK_9b085ea6f0570114685cedab8a3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson_users_user" DROP CONSTRAINT "FK_9b085ea6f0570114685cedab8a3"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP CONSTRAINT "FK_54b53238a8279826f95be669f8d"`);
        await queryRunner.query(`ALTER TABLE "code_module" DROP CONSTRAINT "FK_3126c366bff35466d2fd0969286"`);
        await queryRunner.query(`DROP INDEX "IDX_9b085ea6f0570114685cedab8a"`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" DROP CONSTRAINT "PK_8b171f8975ffec63c490938a83c"`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" ADD CONSTRAINT "PK_5fea17f3ea912b2cafbb1e65f60" PRIMARY KEY ("lessonId")`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_9b085ea6f0570114685cedab8a" ON "lesson_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" DROP CONSTRAINT "PK_5fea17f3ea912b2cafbb1e65f60"`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" ADD CONSTRAINT "PK_8b171f8975ffec63c490938a83c" PRIMARY KEY ("lessonId", "userId")`);
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP CONSTRAINT "PK_fea86db187949398f8b614f730a"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD CONSTRAINT "PK_fea86db187949398f8b614f730a" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "code_module" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "code_module" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "code_module" ADD CONSTRAINT "FK_3126c366bff35466d2fd0969286" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_users_user" ADD CONSTRAINT "FK_9b085ea6f0570114685cedab8a3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checkpoint" ADD CONSTRAINT "FK_54b53238a8279826f95be669f8d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
