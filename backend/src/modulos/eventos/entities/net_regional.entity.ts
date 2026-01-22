// Módulo: backend/eventos
// Función: Entidad Regional (zonas geográficas de cobertura)
// Relacionados: net_eventos (FK idRegional), eventos.service (listarRegionales)
// Notas: Se corrige la relación errónea con municipio; Regional no depende
// de municipio. Mantiene PK y vincula OneToMany con eventos.
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { net_eventos } from './net_eventos.entity';


@Entity('NET_REGIONAL')
export class net_regional {
  @PrimaryGeneratedColumn({ name: 'ID_REGIONAL', type: 'number' })
  id: number;


  @Column({
    name: 'NOMBRE_REGIONAL',
    type: 'varchar2',
    length: 50,
    nullable: false,
  })
  nombres: string;

  // Relación One-to-Many con eventos (cada regional puede tener varios eventos)
  @OneToMany(() => net_eventos, (evento) => evento.regional)
  eventos: net_eventos[];

}