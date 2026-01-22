import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { net_eventos } from './net_eventos.entity';
import { net_docentes } from './net_docentes.entity';
import { net_estados } from './net_estados.entity';

@Entity('NET_REGISTRO_EVENTOS')
@Index('IDX_REGISTRO_EVENTO', ['evento'])
@Index('IDX_REGISTRO_DOCENTE', ['docente'])
@Index('IDX_REGISTRO_FECHA', ['fechaRegistro'])
@Index('IDX_REGISTRO_ESTADO', ['estado'])
export class registro_evento {

  @PrimaryGeneratedColumn({ name: 'ID_REGISTRO_EVENTO', type: 'number' })
  id: number;

  @ManyToOne(() => net_eventos, (evento) => evento.registros)
  @JoinColumn({ name: 'ID_EVENTO' })
  evento: net_eventos;

  @ManyToOne(() => net_docentes, (docente) => docente.registros)
  @JoinColumn({ name: 'ID_PERSONA' })
  docente: net_docentes;

  @Column({
    name: 'FECHA_REGISTRO',
    type: 'timestamp',
    nullable: false,
  })
  fechaRegistro: Date;

  @Column({
    name: 'CANTIDAD_INV_DOCENTE',
    type: 'number',
    nullable: true,
  })
  cantidadInvDocente?: number;

  @ManyToOne(() => net_estados)
  @JoinColumn({ name: 'ID_ESTADO' })
  estado?: net_estados;
}
