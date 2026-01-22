import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('NET_ESTADOS')
@Index('IDX_ESTADOS_CLASIFICACION', ['clasificacion'])
@Index('IDX_ESTADOS_NOMBRE', ['nombreEstado'])
export class net_estados {
  @PrimaryGeneratedColumn({ name: 'ID_ESTADO', type: 'number' })
  id: number;

  @Column({ name: 'NOMBRE_ESTADO', type: 'varchar2', length: 50, nullable: false })
  nombreEstado: string;

  @Column({ name: 'DESCRIPCION', type: 'varchar2', length: 200, nullable: true })
  descripcion?: string;

  @Column({ name: 'CLASIFICACION', type: 'varchar2', length: 20, nullable: false })
  clasificacion: string; // 'DOCENTE' | 'EVENTO'
}
