import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('NET_TIPO_IDENTIFICACION')
export class net_tipo_identificacion {
  @PrimaryGeneratedColumn({ name: 'ID_TIPO_IDENTIFICACION', type: 'number' })
  id: number;

  @Column({
    name: 'TIPO_IDENTIFICACION',
    type: 'varchar2',
    length: 50,
    nullable: false,
  })
  nombreTipo: string;

}