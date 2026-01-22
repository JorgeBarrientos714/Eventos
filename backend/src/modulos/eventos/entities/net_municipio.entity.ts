import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { net_departamento } from './net_departamento.entity';
import { net_docentes } from './net_docentes.entity';
import { net_eventos } from './net_eventos.entity';

@Entity('NET_MUNICIPIO')
@Index('IDX_MUNICIPIO_DEPARTAMENTO', ['id_departamento'])
export class net_municipio {
  @PrimaryGeneratedColumn({ name: 'ID_MUNICIPIO', type: 'number' })
  id: number;


  @Column({
    name: 'NOMBRES_MUNICIPIO',
    type: 'varchar2',
    length: 50,
    nullable: false,
  })
  nombres: string;

  @Column({
    name: 'ID_DEPARTAMENTO',
    type: 'number',
    nullable: false,
  })
  id_departamento: number;

  // Relación Many-to-One con departamento
  @ManyToOne(() => net_departamento, (departamento) => departamento.municipios)
  @JoinColumn({ name: 'ID_DEPARTAMENTO' })
  departamento: net_departamento;

  // Relación One-to-Many con docentes
  @OneToMany(() => net_docentes, (docente) => docente.municipioResidencia)
  docentes: net_docentes[];



  // Relación One-to-Many con eventosa
  @OneToMany(() => net_eventos, (eventos) => eventos.municipio)
  eventos: net_eventos[];

}