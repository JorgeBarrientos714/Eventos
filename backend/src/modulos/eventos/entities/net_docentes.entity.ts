import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, Index, ManyToMany, JoinTable } from 'typeorm';
import { net_municipio } from './net_municipio.entity';
import { net_grupo_etnico } from './net_grupo_etnico.entity';
import { net_tipo_identificacion } from './net_tipo_identificacion.entity';
import { net_pais } from './net_pais.entity';
import { net_colonia } from './net_colonia.entity';
import { net_aldea } from './net_aldea.entity';
import { registro_evento } from './net_registro_evento.entity';
import { net_discapacidades } from './net_discapacidades.entity';

@Entity('NET_DOCENTE')
@Index('IDX_N_IDENTIFICACION', ['nIdentificacion'])
@Index('IDX_RTN', ['rtn'])
@Index('IDX_TIPO_IDENTIFICACION', ['idTipoIdentificacion'])
@Index('IDX_PAIS_NACIONALIDAD', ['idPaisNacionalidad'])
@Index('IDX_MUNICIPIO_RESIDENCIA', ['idMunicipioResidencia'])
@Index('IDX_MUNICIPIO_NACIMIENTO', ['idMunicipioNacimiento'])
@Index('IDX_MUNICIPIO_DEFUNCION', ['idMunicipioDefuncion'])
@Index('IDX_COLONIA', ['idColonia'])
@Index('IDX_ALDEA', ['idAldea'])
@Index('IDX_USUARIO_EMPRESA', ['idUsuarioEmpresa'])
export class net_docentes {
  @PrimaryGeneratedColumn({ name: 'ID_PERSONA', type: 'number' })
  id: number;

  @Column({
    name: 'N_IDENTIFICACION',
    type: 'varchar2',
    length: 20,
    nullable: true,
  })
  nIdentificacion?: string;

  @Column({
    name: 'RTN',
    type: 'varchar2',
    length: 14,
    nullable: true,
  })
  rtn?: string;

  @Column({
    name: 'ESTADO_CIVIL',
    type: 'varchar2',
    length: 40,
    nullable: true,
  })
  estadoCivil?: string;

  @Column({
    name: 'PRIMER_NOMBRE',
    type: 'varchar2',
    length: 40,
    nullable: true,
  })
  primerNombre?: string;

  @Column({
    name: 'SEGUNDO_NOMBRE',
    type: 'varchar2',
    length: 40,
    nullable: true,
  })
  segundoNombre?: string;

  @Column({
    name: 'TERCER_NOMBRE',
    type: 'varchar2',
    length: 40,
    nullable: true,
  })
  tercerNombre?: string;

  @Column({
    name: 'PRIMER_APELLIDO',
    type: 'varchar2',
    length: 40,
    nullable: true,
  })
  primerApellido?: string;

  @Column({
    name: 'SEGUNDO_APELLIDO',
    type: 'varchar2',
    length: 40,
    nullable: true,
  })
  segundoApellido?: string;

  @Column({
    name: 'GENERO',
    type: 'varchar2',
    length: 30,
    nullable: true,
  })
  genero?: string;

  @Column({
    name: 'FALLECIDO',
    type: 'varchar2',
    length: 2,
    default: () => "'NO'",
    nullable: true,
  })
  fallecido?: string;

  @Column({
    name: 'CANTIDAD_HIJOS',
    type: 'number',
    nullable: true,
  })
  cantidadHijos?: number;

  @Column({
    name: 'TELEFONO_1',
    type: 'varchar2',
    length: 12,
    nullable: true,
  })
  telefono1?: string;

  @Column({
    name: 'TELEFONO_2',
    type: 'varchar2',
    length: 12,
    nullable: true,
  })
  telefono2?: string;

  @Column({
    name: 'FECHA_NACIMIENTO',
    type: 'date',
    nullable: true,
  })
  fechaNacimiento?: Date;

  @Column({
    name: 'DIRECCION_RESIDENCIA',
    type: 'varchar2',
    length: 500,
    nullable: true,
  })
  direccionResidencia?: string;

  @Column({
    name: 'FOTO_PERFIL',
    type: 'blob',
    nullable: true,
  })
  fotoPerfil?: Buffer;

  @Column({
    name: 'DIRECCION_RESIDENCIA_ESTRUCTURADA',
    type: 'varchar2',
    length: 500,
    nullable: true,
  })
  direccionResidenciaEstructurada?: string;

  @Column({
    name: 'OBSERVACION',
    type: 'varchar2',
    length: 500,
    nullable: true,
  })
  observacion?: string;

  @Column({
    name: 'CORREO_1',
    type: 'varchar2',
    length: 60,
    nullable: true,
  })
  correo1?: string;

  @Column({
    name: 'CORREO_2',
    type: 'varchar2',
    length: 60,
    nullable: true,
  })
  correo2?: string;

  @Column({
    name: 'ULTIMA_FECHA_ACTUALIZACION',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  ultimaFechaActualizacion: Date;

  @Column({
    name: 'ASISTIO',
    type: 'varchar2',
    length: 2,
    default: () => "'NO'",
    nullable: true,
  })
  asistio?: string; // 'SI' | 'NO'

  @Column({
    name: 'PENALIZADO',
    type: 'varchar2',
    length: 2,
    default: () => "'NO'",
    nullable: true,
  })
  penalizado?: string; // 'SI' | 'NO'

  // Foreign Keys
  @Column({
    name: 'ID_TIPO_IDENTIFICACION',
    type: 'number',
    nullable: true,
  })
  idTipoIdentificacion?: number;

  @Column({
    name: 'ID_PAIS_NACIONALIDAD',
    type: 'number',
    nullable: true,
  })
  idPaisNacionalidad?: number;

  @Column({
    name: 'ID_MUNICIPIO_RESIDENCIA',
    type: 'number',
    nullable: true,
  })
  idMunicipioResidencia?: number;

  @Column({
    name: 'ID_MUNICIPIO_NACIMIENTO',
    type: 'number',
    nullable: true,
  })
  idMunicipioNacimiento?: number;

  @Column({
    name: 'ID_MUNICIPIO_DEFUNCION',
    type: 'number',
    nullable: true,
  })
  idMunicipioDefuncion?: number;

  @Column({
    name: 'ID_USUARIO_EMPRESA',
    type: 'number',
    nullable: true,
  })
  idUsuarioEmpresa?: number;

  @Column({
    name: 'ID_COLONIA',
    type: 'number',
    nullable: true,
  })
  idColonia?: number;

  @Column({
    name: 'ID_GRUPO_ETNICO',
    type: 'number',
    nullable: true,
  })
  idGrupoEtnico?: number;

  @Column({
    name: 'ID_ALDEA',
    type: 'number',
    nullable: true,
  })
  idAldea?: number;

  // Relaciones Many-to-One
  @ManyToOne(() => net_tipo_identificacion)
  @JoinColumn({ name: 'ID_TIPO_IDENTIFICACION' })
  tipoIdentificacion?: net_tipo_identificacion;

  @ManyToOne(() => net_pais)
  @JoinColumn({ name: 'ID_PAIS_NACIONALIDAD' })
  paisNacionalidad?: net_pais;

  @ManyToOne(() => net_municipio, (municipio) => municipio.docentes)
  @JoinColumn({ name: 'ID_MUNICIPIO_RESIDENCIA' })
  municipioResidencia?: net_municipio;

  @ManyToOne(() => net_municipio)
  @JoinColumn({ name: 'ID_MUNICIPIO_NACIMIENTO' })
  municipioNacimiento?: net_municipio;

  @ManyToOne(() => net_municipio)
  @JoinColumn({ name: 'ID_MUNICIPIO_DEFUNCION' })
  municipioDefuncion?: net_municipio;

  @ManyToOne(() => net_colonia)
  @JoinColumn({ name: 'ID_COLONIA' })
  colonia?: net_colonia;

  @ManyToOne(() => net_aldea)
  @JoinColumn({ name: 'ID_ALDEA' })
  aldea?: net_aldea;

  @ManyToOne(() => net_grupo_etnico)
  @JoinColumn({ name: 'ID_GRUPO_ETNICO' })
  grupoEtnico?: net_grupo_etnico;

  @ManyToMany(() => net_discapacidades)
  @JoinTable({
    name: 'NET_DOCENTE_DISCAPACIDADES',
    joinColumn: { name: 'ID_PERSONA', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ID_DISCAPACIDAD', referencedColumnName: 'id' },
  })
  discapacidades?: net_discapacidades[];

  @OneToMany(() => registro_evento, (registro) => registro.docente)
  registros?: registro_evento[];
}