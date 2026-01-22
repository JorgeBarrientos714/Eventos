import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { net_clases } from './net_clases.entity';
import { net_empleado } from './net_empleado.entity';


@Entity('NET_AREAS')
export class net_areas {
  @PrimaryGeneratedColumn({ name: 'ID_AREA', type: 'number' })
  id: number;


  @Column({
    name: 'NOMBRE_AREA',
    type: 'varchar2',
    length: 50,
    nullable: false,
  })
  nombres: string;


  // Relación One-to-Many con clases
  @OneToMany(() => net_clases, (clase) => clase.area)
  clases: net_clases[];

  // Relación One-to-Many con empleados
  @OneToMany(() => net_empleado, (empleado) => empleado.area)
  empleados: net_empleado[];

}