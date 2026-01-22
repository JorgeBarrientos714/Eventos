import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { net_empleado } from './net_empleado.entity';
import { net_eventos } from './net_eventos.entity';
import { net_usuario_recuperacion } from './net_usuario_recuperacion.entity';

@Entity('NET_USUARIO')
export class net_usuario {
  @PrimaryGeneratedColumn({ name: 'ID_USUARIO', type: 'number' })
  id: number;

  @Column({
    name: 'CORREO_ELECTRONICO',
    type: 'varchar2',
    length: 150,
    nullable: false,
  })
  correoElectronico: string;

  @Column({
    name: 'CONTRASENA',
    type: 'varchar2',
    length: 200,
    nullable: false,
  })
  contrasena: string;

  @Column({
    name: 'ID_EMPLEADO',
    type: 'number',
    nullable: false,
  })
  idEmpleado: number;

  @ManyToOne(() => net_empleado, (empleado) => empleado.usuarios)
  @JoinColumn({ name: 'ID_EMPLEADO' })
  empleado: net_empleado;

  @OneToMany(() => net_eventos, (evento) => evento.usuario)
  eventos: net_eventos[];

  @OneToMany(() => net_usuario_recuperacion, (recuperacion) => recuperacion.usuario)
  recuperaciones: net_usuario_recuperacion[];
}
