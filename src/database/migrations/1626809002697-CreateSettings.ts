import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSettings1626809002697 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name:"settings", // nome da tabela
                columns: [
                    {
                        name:"id", // nome da coluna
                        type:"uuid", // type da coluna
                        isPrimary:true,
                    },
                    {
                        name:"username",
                        type:"varchar"
                    },
                    {
                        name:"chat",
                        type:"boolean",
                        default: true
                    },
                    {
                        name:"updated_at",
                        type:"timestamp",
                        default: "now()"
                    },
                    {
                        name:"created_at",
                        type:"timestamp",
                        default: "now()" // pega o horario atual
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("settings")
    }

}
