import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, Index } from 'typeorm';
import { net_municipio } from './net_municipio.entity';
import { net_pais } from './net_pais.entity';


@Entity('NET_DEPARTAMENTO')
export class net_departamento {
  @PrimaryGeneratedColumn({ name: 'ID_DEPARTAMENTO', type: 'number' })
  id: number;


  @Column({
    name: 'NOMBRES_DEPARTAMENTO',
    type: 'varchar2',
    length: 50,
    nullable: false,
  })
  nombres: string;

  @Column({
    name: 'ID_PAIS',
    type: 'number',
    nullable: true,
  })
  @Index('IDX_DEPARTAMENTO_PAIS')
  idPais?: number;

  @ManyToOne(() => net_pais)
  @JoinColumn({ name: 'ID_PAIS' })
  pais?: net_pais;

  // Relación One-to-Many con municipios
  @OneToMany(() => net_municipio, (municipio) => municipio.departamento)
  municipios: net_municipio[];




}