import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { net_docentes } from './net_docentes.entity';
import { net_discapacidades } from './net_discapacidades.entity';

@Entity('NET_DOCENTE_DISCAPACIDADES')
@Unique('UQ_DD_PERSONA_DISCAP', ['idPersona', 'idDiscapacidad'])
@Index('IDX_DD_PERSONA', ['idPersona'])
@Index('IDX_DD_DISCAPACIDAD', ['idDiscapacidad'])
export class net_docente_discapacidades {
  @PrimaryGeneratedColumn({ name: 'ID_DOCENTE_DISCAPACIDADES', type: 'number' })
  id: number;

  @Column({ name: 'ID_PERSONA', type: 'number' })
  idPersona: number;

  @Column({ name: 'ID_DISCAPACIDAD', type: 'number' })
  idDiscapacidad: number;

  @ManyToOne(() => net_docentes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_PERSONA' })
  docente: net_docentes;

  @ManyToOne(() => net_discapacidades, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ID_DISCAPACIDAD' })
  discapacidad: net_discapacidades;
}
