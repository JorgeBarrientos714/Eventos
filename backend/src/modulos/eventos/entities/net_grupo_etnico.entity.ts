import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { net_docentes } from './net_docentes.entity';


@Entity('NET_GRUPO_ETNICO')
export class net_grupo_etnico {
  @PrimaryGeneratedColumn({ name: 'ID_GRUPO_ETNICO', type: 'number' })
  id: number;


  @Column({
    name: 'NOMBRE_GRUPO_ETNICO',
    type: 'varchar2',
    length: 50,
    nullable: false,
  })
  nombreGrupoEtnico: string;


  // Relación One-to-Many con docentes
  @OneToMany(() => net_docentes, (docente) => docente.grupoEtnico)
  docentes: net_docentes[];

}