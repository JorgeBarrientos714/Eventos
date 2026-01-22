import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { net_municipio } from './net_municipio.entity';

@Entity('NET_ALDEA')
@Index('IDX_ALDEA_MUNICIPIO', ['idMunicipio'])
export class net_aldea {
  @PrimaryGeneratedColumn({ name: 'ID_ALDEA', type: 'number' })
  id: number;

  @Column({
    name: 'NOMBRE_ALDEA',
    type: 'varchar2',
    length: 50,
    nullable: false,
  })
  nombreAldea: string;

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

  // Relación con municipio
  @ManyToOne(() => net_municipio)
  @JoinColumn({ name: 'ID_MUNICIPIO' })
  municipio?: net_municipio;
}