import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class DropImagenUrl20260120163000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('NET_EVENTOS', 'IMAGEN_URL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'NET_EVENTOS',
      new TableColumn({
        name: 'IMAGEN_URL',
        type: 'varchar2',
        length: '1000',
        isNullable: true,
      }),
    );
  }
}
