import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { net_areas } from './net_areas.entity';
import { net_eventos } from './net_eventos.entity';


@Entity('NET_CLASES')
@Index('IDX_CLASE_AREA', ['id_areas'])
export class net_clases {
  [x: string]: any;
  @PrimaryGeneratedColumn({ name: 'ID_CLASE', type: 'number' })
  id: number;


  @Column({
    name: 'NOMBRE_CLASE',
    type: 'varchar2',
    length: 120,
    nullable: false,
  })
  nombre: string;


  @Column({
    name: 'ID_AREA',
    type: 'number',
    nullable: false,
  })
  id_areas: number;


  // Relación Many-to-One con areas
  @ManyToOne(() => net_areas, (area) => area.clases)
  @JoinColumn({ name: 'ID_AREA' })
  area: net_areas;


  // Relación One-to-Many con municipios
  @OneToMany(() => net_eventos, (eventos) => eventos.clase)
  eventos: net_eventos[];

}