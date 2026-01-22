import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { net_usuario } from './net_usuario.entity';

@Entity('NET_USUARIO_RECUPERACION')
export class net_usuario_recuperacion {
  @PrimaryGeneratedColumn({ name: 'ID_RECUPERACION', type: 'number' })
  id: number;

  @Column({
    name: 'TOKEN',
    type: 'varchar2',
    length: 120,
    nullable: false,
  })
  token: string;

  @Column({
    name: 'EXPIRA',
    type: 'timestamp',
    nullable: false,
  })
  expira: Date;

  @Column({
    name: 'UTILIZADO',
    type: 'number',
    default: () => '0',
    nullable: false,
  })
  utilizado: number;

  @Column({
    name: 'ID_USUARIO',
    type: 'number',
    nullable: false,
  })
  idUsuario: number;

  @ManyToOne(() => net_usuario, (usuario) => usuario.recuperaciones)
  @JoinColumn({ name: 'ID_USUARIO' })
  usuario: net_usuario;
}
