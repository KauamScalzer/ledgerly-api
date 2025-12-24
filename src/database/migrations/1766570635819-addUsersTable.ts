import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsersTable1766570635819 implements MigrationInterface {
    name = 'AddUsersTable1766570635819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "google_sub" character varying NOT NULL, "email" character varying NOT NULL, "name" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_68b61ba0fb359b93b517cf1073" ON "users" ("google_sub") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68b61ba0fb359b93b517cf1073"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
