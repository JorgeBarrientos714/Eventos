import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { net_municipio } from './net_municipio.entity';
import { net_clases } from './net_clases.entity';
import { registro_evento } from './net_registro_evento.entity';
import { net_regional } from './net_regional.entity';
import { net_usuario } from './net_usuario.entity';


@Entity('NET_EVENTOS')
@Index('IDX_EVENTO_MUNICIPIO', ['idMunicipio'])
@Index('IDX_EVENTO_CLASE', ['idClase'])
@Index('IDX_EVENTO_REGIONAL', ['idRegional'])
@Index('IDX_EVENTO_FECHA_INICIO', ['fechaInicio'])
@Index('IDX_EVENTO_FECHA_FIN', ['fechaFin'])
@Index('IDX_EVENTO_USUARIO', ['idUsuario'])
export class net_eventos {
  @PrimaryGeneratedColumn({ name: 'ID_EVENTO', type: 'number' })
  id: number;


  @Column({
    name: 'NOMBRE_EVENTO',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  nombreEvento: string;

  @Column({
    name: 'DESCRIPCION',
    type: 'varchar',
    length: 400,
    nullable: true,
  })
  descripcion: string;

  @Column({
    name: 'TIPO_EVENTO',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  tipoEvento?: string;

  @Column({
    name: 'ID_CLASE',
    type: 'number',
    nullable: true,
  })
  idClase: number;

  @Column({
    name: 'DIAS_SEMANA',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  diasSemana: string;

  @Column({
    name: 'ID_MUNICIPIO',
    type: 'number',
    nullable: true,
  })
  idMunicipio: number;

  @Column({
    name: 'DIRECCION',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  direccion: string;

  @Column({
    name: 'FECHA_INICIO',
    type: 'date',
    nullable: false,
  })
  fechaInicio: Date;

  @Column({
    name: 'FECHA_FIN',
    type: 'date',
    nullable: false,
  })
  fechaFin: Date;

  @Column({
    name: 'HORA_INICIO',
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  horaInicio: string;

  @Column({
    name: 'HORA_FIN',
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  horaFin: string;

  @Column({
    name: 'CUPOS_DISPONIBLES',
    type: 'number',
    precision: 6,
    scale: 0,
    nullable: true,
  })
  cuposDisponibles: number;

  @Column({
    name: 'CUPOS_TOTALES',
    type: 'number',
    precision: 6,
    scale: 0,
    nullable: true,
  })
  cuposTotales: number;

  @Column({
    name: 'CANTIDAD_INV_PERMITIDOS',
    type: 'number',
    nullable: true,
  })
  cantidadInvPermitidos?: number;

  @Column({
    name: 'IMAGEN_BLOB',
    type: 'blob',
    nullable: true,
  })
  imagenBlob?: Buffer;

  @Column({
    name: 'IMAGEN_MIME',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  imagenMime?: string;


  @Column({
    name: 'ID_USUARIO',
    type: 'number',
    nullable: true,
  })
  idUsuario: number;

  @Column({
    name: 'ID_REGIONAL',
    type: 'number',
    nullable: true,
  })
  idRegional: number;


  // Relación Many-to-One con municipio
  @ManyToOne(() => net_municipio, (municipio) => municipio.eventos)
  @JoinColumn({ name: 'ID_MUNICIPIO' })
  municipio: net_municipio;



  // Relación Many-to-One con clase
  @ManyToOne(() => net_clases, (clase) => clase.eventos)
  @JoinColumn({ name: 'ID_CLASE' })
  clase: net_clases;

  // Relación Many-to-One con regional
  @ManyToOne(() => net_regional, (regional) => regional.eventos)
  @JoinColumn({ name: 'ID_REGIONAL' })
  regional: net_regional;

  // Relación Many-to-One con usuario creador
  @ManyToOne(() => net_usuario, (usuario) => usuario.eventos)
  @JoinColumn({ name: 'ID_USUARIO' })
  usuario?: net_usuario;

  // Relación One-to-Many con Registro Evento
  @OneToMany(() => registro_evento, (registro_evento) => registro_evento.evento)
  registros: registro_evento[];



}