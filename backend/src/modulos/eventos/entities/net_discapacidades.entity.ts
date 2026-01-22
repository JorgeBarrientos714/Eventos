import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('NET_DISCAPACIDADES')
@Index('IDX_DISCAPACIDADES_NOMBRE', ['nombre'])
export class net_discapacidades {
  @PrimaryGeneratedColumn({ name: 'ID_DISCAPACIDAD', type: 'number' })
  id: number;

  @Column({ name: 'NOMBRE', type: 'varchar2', length: 100, nullable: false })
  nombre: string;

  @Column({ name: 'DESCRIPCION', type: 'varchar2', length: 400, nullable: true })
  descripcion?: string;
}
