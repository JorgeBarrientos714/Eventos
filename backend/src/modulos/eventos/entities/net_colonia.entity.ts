import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('NET_COLONIA')
@Index('IDX_COLONIA_MUNICIPIO', ['idMunicipio'])
export class net_colonia {
  @PrimaryGeneratedColumn({ name: 'ID_COLONIA', type: 'number' })
  id: number;

  @Column({
    name: 'NOMBRE_COLONIA',
    type: 'varchar2',
    length: 50,
    nullable: false,
  })
  nombreColonia: string;

  @Column({
    name: 'ID_MUNICIPIO',
    type: 'number',
    nullable: false,
  })
  idMunicipio: number;

  @Column({
    name: 'ESTADO',
    type: 'varchar2',
    length: 50,
    nullable: false,
  })
  estado: string;

  @Column({
    name: 'OBSERVACION',
    type: 'varchar2',
    length: 100,
    nullable: true,
  })
  observacion?: string;
}