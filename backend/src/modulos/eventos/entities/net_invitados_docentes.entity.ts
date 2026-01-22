import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { registro_evento } from './net_registro_evento.entity';

@Entity('NET_INVITADOS_DOCENTES')
@Index('IDX_INVITADO_REGISTRO', ['idRegistroEvento'])
@Index('IDX_INVITADO_DNI', ['dniInvitado'])
export class net_invitados_docentes {
  @PrimaryGeneratedColumn({ name: 'ID_INVITADO', type: 'number' })
  id: number;

  @Column({ name: 'ID_REGISTRO_EVENTO', type: 'number' })
  idRegistroEvento: number;

  @Column({ name: 'DNI_INVITADO', type: 'varchar2', length: 20, nullable: false })
  dniInvitado: string;

  @Column({ name: 'NOMBRE_INVITADO', type: 'varchar2', length: 200, nullable: false })
  nombreInvitado: string;

  @ManyToOne(() => registro_evento, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_REGISTRO_EVENTO' })
  registroEvento: registro_evento;
}
