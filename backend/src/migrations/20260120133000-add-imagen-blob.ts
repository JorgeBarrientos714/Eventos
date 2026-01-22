import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddImagenBlobToEventos20260120133000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('NET_EVENTOS', [
      new TableColumn({
        name: 'IMAGEN_BLOB',
        type: 'blob',
        isNullable: true,
      }),
      new TableColumn({
        name: 'IMAGEN_MIME',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('NET_EVENTOS', 'IMAGEN_MIME');
    await queryRunner.dropColumn('NET_EVENTOS', 'IMAGEN_BLOB');
  }
}
