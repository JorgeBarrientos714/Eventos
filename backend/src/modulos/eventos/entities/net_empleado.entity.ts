import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { net_areas } from './net_areas.entity';
import { net_usuario } from './net_usuario.entity';

@Entity('NET_EMPLEADO')
export class net_empleado {
  @PrimaryGeneratedColumn({ name: 'ID_EMPLEADO', type: 'number' })
  id: number;

  @Column({
    name: 'NOMBRE',
    type: 'varchar2',
    length: 150,
    nullable: false,
  })
  nombre: string;

  @Column({
    name: 'NUMERO_EMPLEADO',
    type: 'varchar2',
    length: 40,
    nullable: false,
  })
  numeroEmpleado: string;

  @Column({
    name: 'DNI',
    type: 'varchar2',
    length: 20,
    nullable: false,
  })
  dni: string;

  @Column({
    name: 'ID_AREA',
    type: 'number',
    nullable: false,
  })
  idArea: number;

  @ManyToOne(() => net_areas, (area) => area.empleados)
  @JoinColumn({ name: 'ID_AREA' })
  area: net_areas;

  @OneToMany(() => net_usuario, (usuario) => usuario.empleado)
  usuarios: net_usuario[];
}
