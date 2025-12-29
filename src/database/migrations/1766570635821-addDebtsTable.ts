import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDebtsTable1766570635821 implements MigrationInterface {
    name = 'AddDebtsTable1766570635821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."debts_type_enum" AS ENUM('PAYABLE', 'RECEIVABLE')`);
        await queryRunner.query(`CREATE TABLE "debts" ("id" SERIAL NOT NULL, "owner_user_id" integer NOT NULL, "tag_id" integer NOT NULL, "type" "public"."debts_type_enum" NOT NULL, "amount_cents" integer NOT NULL, "description" character varying, "due_date" TIMESTAMP WITH TIME ZONE NOT NULL, "paid" boolean NOT NULL DEFAULT false, "paid_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c6f1c1a1a9c1eb471bdbe5413c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_debts_owner_due" ON "debts" ("owner_user_id", "due_date") `);
        await queryRunner.query(`ALTER TABLE "debts" ADD CONSTRAINT "FK_debts_owner_user" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "debts" ADD CONSTRAINT "FK_debts_tag" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "debts" DROP CONSTRAINT "FK_debts_tag"`);
        await queryRunner.query(`ALTER TABLE "debts" DROP CONSTRAINT "FK_debts_owner_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_debts_owner_due"`);
        await queryRunner.query(`DROP TABLE "debts"`);
        await queryRunner.query(`DROP TYPE "public"."debts_type_enum"`);
    }

}
