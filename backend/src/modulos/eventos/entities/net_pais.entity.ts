import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('NET_PAIS')
export class net_pais {
  @PrimaryGeneratedColumn({ name: 'ID_PAIS', type: 'number' })
  id: number;

  @Column({
    name: 'NOMBRE_PAIS',
    type: 'varchar2',
    length: 50,
    nullable: false,
  })
  nombrePais: string;

  @Column({
    name: 'NACIONALIDAD',
    type: 'varchar2',
    length: 50,
    nullable: false,
  })
  nacionalidad: string;
}