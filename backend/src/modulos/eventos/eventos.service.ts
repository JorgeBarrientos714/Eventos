import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { net_docentes } from './entities/net_docentes.entity';
import { net_eventos } from './entities/net_eventos.entity';
import { Repository, In } from 'typeorm';
import { UpdateEventoDto, CreateEventoFullDto, UpdateEventoFullDto } from './dto/update-evento.dto';
import { registro_evento } from './entities/net_registro_evento.entity';
import { net_estados } from './entities/net_estados.entity';
import { net_discapacidades } from './entities/net_discapacidades.entity';
import { net_departamento } from './entities/net_departamento.entity';
import { net_municipio } from './entities/net_municipio.entity';
import { net_clases } from './entities/net_clases.entity';
import { net_areas } from './entities/net_areas.entity';
import { net_regional } from './entities/net_regional.entity';
import { net_aldea } from './entities/net_aldea.entity';
import { net_grupo_etnico } from './entities/net_grupo_etnico.entity';
import { net_docente_discapacidades } from './entities/net_docente_discapacidades.entity';
import { net_invitados_docentes } from './entities/net_invitados_docentes.entity';
import { CreateRegistroEventoDto } from './dto/create-registro-evento.dto';
import { net_empleado } from './entities/net_empleado.entity';
import { net_usuario } from './entities/net_usuario.entity';
import { net_usuario_recuperacion } from './entities/net_usuario_recuperacion.entity';
import { RegistrarUsuarioDto, LoginUsuarioDto, RecuperarPasswordDto, RestablecerPasswordDto, CambiarPasswordDto } from './dto/auth.dto';
import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'crypto';

 
@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(net_docentes)
    private readonly netDocenteRepository: Repository<net_docentes>,

    @InjectRepository(net_eventos)
    private readonly eventosRepository: Repository<net_eventos>,

    @InjectRepository(registro_evento)
    private readonly registroEventoRepository: Repository<registro_evento>,

    @InjectRepository(net_estados)
    private readonly estadosRepository: Repository<net_estados>,

    @InjectRepository(net_discapacidades)
    private readonly discapacidadesRepository: Repository<net_discapacidades>,

    @InjectRepository(net_departamento)
    private readonly departamentoRepository: Repository<net_departamento>,

    @InjectRepository(net_municipio)
    private readonly municipioRepository: Repository<net_municipio>,

    @InjectRepository(net_clases)
    private readonly clasesRepository: Repository<net_clases>,

    @InjectRepository(net_areas)
    private readonly areasRepository: Repository<net_areas>,

    @InjectRepository(net_regional)
    private readonly regionalRepository: Repository<net_regional>,

    @InjectRepository(net_empleado)
    private readonly empleadoRepository: Repository<net_empleado>,

    @InjectRepository(net_usuario)
    private readonly usuarioRepository: Repository<net_usuario>,

    @InjectRepository(net_usuario_recuperacion)
    private readonly recuperacionRepository: Repository<net_usuario_recuperacion>,

    @InjectRepository(net_aldea)
    private readonly aldeaRepository: Repository<net_aldea>,

    @InjectRepository(net_grupo_etnico)
    private readonly grupoEtnicoRepository: Repository<net_grupo_etnico>,

    @InjectRepository(net_docente_discapacidades)
    private readonly docenteDiscapacidadesRepository: Repository<net_docente_discapacidades>,

    @InjectRepository(net_invitados_docentes)
    private readonly invitadosDocentesRepository: Repository<net_invitados_docentes>,

  ) { }

  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hashed = scryptSync(password, salt, 64);
    return `${salt}:${hashed.toString('hex')}`;
  }

  private verifyPassword(password: string, stored?: string): boolean {
    if (!stored) {
      return false;
    }
    const [salt, key] = stored.split(':');
    if (!salt || !key) {
      return false;
    }
    const hashedBuffer = Buffer.from(key, 'hex');
    const derived = scryptSync(password, salt, 64);
    try {
      return timingSafeEqual(derived, hashedBuffer);
    } catch (error) {
      return false;
    }
  }

  private parseBase64Image(data?: string): { buffer: Buffer; mime: string } | null {
    if (!data) {
      return null;
    }

    const matches = data.match(/^data:(.+);base64,(.+)$/);
    const mime = matches?.[1] ?? 'image/png';
    const base64Payload = matches?.[2] ?? data;

    try {
      return { buffer: Buffer.from(base64Payload, 'base64'), mime };
    } catch (error) {
      return null;
    }
  }

  // ==================== AUTENTICACIÓN DOCENTE (LIGERA) ====================
  private getDocenteAuthSecret(): string {
    return process.env.DOCENTE_AUTH_SECRET || 'inprema-docente-secret';
  }

  private base64UrlEncode(obj: any): string {
    const json = typeof obj === 'string' ? obj : JSON.stringify(obj);
    return Buffer.from(json).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  private base64UrlDecodeToJSON(b64: string): any {
    const pad = (b64.length % 4 === 0) ? '' : '='.repeat(4 - (b64.length % 4));
    const normalized = b64.replace(/-/g, '+').replace(/_/g, '/') + pad;
    const json = Buffer.from(normalized, 'base64').toString('utf8');
    try { return JSON.parse(json); } catch { return null; }
  }

  private signDocenteToken(payload: { docenteId: number; dni: string; exp?: number }): string {
    const header = { alg: 'HS256', typ: 'DOC' };
    const now = Math.floor(Date.now() / 1000);
    const exp = payload.exp ?? (now + 60 * 60 * 24); // 24h
    const body = { ...payload, iat: now, exp };
    const part1 = this.base64UrlEncode(header);
    const part2 = this.base64UrlEncode(body);
    const data = `${part1}.${part2}`;
    const sig = createHmac('sha256', this.getDocenteAuthSecret()).update(data).digest('base64')
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    return `${data}.${sig}`;
  }

  private verifyDocenteToken(token?: string): { docenteId: number; dni: string } | null {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [p1, p2, sig] = parts;
    const data = `${p1}.${p2}`;
    const expected = createHmac('sha256', this.getDocenteAuthSecret()).update(data).digest('base64')
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    if (expected !== sig) return null;
    const payload = this.base64UrlDecodeToJSON(p2);
    if (!payload) return null;
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp === 'number' && payload.exp < now) return null;
    return { docenteId: payload.docenteId, dni: payload.dni };
  }

  async iniciarSesionDocente(dni: string) {
    if (!dni || dni.length < 5) {
      throw new BadRequestException('DNI inválido');
    }
    const docente = await this.netDocenteRepository.findOne({ where: { nIdentificacion: dni } });
    if (!docente) {
      throw new NotFoundException('Docente no encontrado');
    }
    const nombre = [docente.primerNombre, docente.segundoNombre, docente.primerApellido, docente.segundoApellido]
      .filter(Boolean).join(' ').trim() || 'Docente';
    const token = this.signDocenteToken({ docenteId: docente.id, dni });
    return {
      token,
      docente: {
        id: docente.id,
        nIdentificacion: docente.nIdentificacion,
        nombreCompleto: nombre,
      }
    };
  }

  async docenteActualDesdeToken(token?: string) {
    const parsed = this.verifyDocenteToken(token);
    if (!parsed) {
      throw new BadRequestException('Token inválido o expirado');
    }
    const docente = await this.netDocenteRepository.findOne({ where: { id: parsed.docenteId } });
    if (!docente) {
      throw new NotFoundException('Docente no encontrado');
    }
    const nombre = [docente.primerNombre, docente.segundoNombre, docente.primerApellido, docente.segundoApellido]
      .filter(Boolean).join(' ').trim() || 'Docente';
    return {
      id: docente.id,
      nIdentificacion: docente.nIdentificacion,
      nombreCompleto: nombre,
    };
  }

  // ==================== MIS INSCRIPCIONES ====================
  async listarMisInscripcionesDesdeToken(token?: string) {
    const parsed = this.verifyDocenteToken(token);
    if (!parsed) {
      throw new BadRequestException('Token inválido o expirado');
    }
    const docenteId = parsed.docenteId;

    const registros = await this.registroEventoRepository.find({
      where: { docente: { id: docenteId } },
      relations: ['evento', 'estado', 'evento.municipio', 'evento.municipio.departamento', 'evento.clase', 'evento.clase.area', 'evento.regional'],
      order: { fechaRegistro: 'DESC' },
    });

    const resultado = [] as any[];
    for (const reg of registros) {
      const invitadosRegistrados = await this.invitadosDocentesRepository.count({ where: { idRegistroEvento: reg.id } });
      const ev: any = reg.evento;
      resultado.push({
        idRegistro: reg.id,
        fechaRegistro: reg.fechaRegistro,
        estado: reg.estado?.nombreEstado ?? 'Sin estado',
        idEstado: reg.estado?.id ?? null,
        invitadosRegistrados,
        evento: {
          id: ev.id,
          nombreEvento: ev.nombreEvento,
          descripcion: ev.descripcion,
          fechaInicio: ev.fechaInicio,
          horaInicio: ev.horaInicio,
          horaFin: ev.horaFin,
          direccion: ev.direccion,
          cuposTotales: ev.cuposTotales,
          cuposDisponibles: ev.cuposDisponibles,
          cantidadInvPermitidos: ev.cantidadInvPermitidos,
          municipio: ev.municipio ? { id: ev.municipio.id, nombres: ev.municipio.nombres } : null,
          departamento: ev.municipio?.departamento ? { id: ev.municipio.departamento.id, nombres: ev.municipio.departamento.nombres } : null,
          clase: ev.clase ? { id: ev.clase.id, nombre: ev.clase.nombre } : null,
          area: ev.clase?.area ? { id: ev.clase.area.id, nombres: ev.clase.area.nombres } : null,
          regional: ev.regional ? { id: ev.regional.id, nombreRegional: ev.regional.nombreRegional } : null,
        }
      });
    }

    return resultado;
  }

  // ==================== CANCELAR INSCRIPCIÓN ====================
  async cancelarInscripcionDesdeToken(token: string | undefined, dto: { idRegistro?: number; idEvento?: number }) {
    const parsed = this.verifyDocenteToken(token);
    if (!parsed) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const docenteId = parsed.docenteId;
    if (!dto.idRegistro && !dto.idEvento) {
      throw new BadRequestException('Debe proporcionar idRegistro o idEvento');
    }

    const queryRunner = this.registroEventoRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscar registro del docente
      let registro = await queryRunner.manager.findOne(registro_evento, {
        where: dto.idRegistro
          ? { id: dto.idRegistro, docente: { id: docenteId } }
          : { evento: { id: dto.idEvento! }, docente: { id: docenteId } },
        relations: ['estado', 'evento'],
      });

      if (!registro) {
        throw new NotFoundException('No se encontró la inscripción para cancelar');
      }

      // Si ya está cancelado, retornar
      if (registro.estado?.nombreEstado === 'Cancelado') {
        await queryRunner.commitTransaction();
        return { mensaje: 'La inscripción ya estaba cancelada', idRegistro: registro.id };
      }

      // Estado Cancelado (clasificación DOCENTE)
      const estadoCancelado = await queryRunner.manager.findOne(net_estados, {
        where: { nombreEstado: 'Cancelado', clasificacion: 'DOCENTE' },
      });
      if (!estadoCancelado) {
        throw new NotFoundException('No está configurado el estado Cancelado');
      }

      // Actualizar estado del registro
      registro.estado = estadoCancelado;
      await queryRunner.manager.save(registro_evento, registro);

      // Liberar cupo del evento si aplica
      const evento = registro.evento as net_eventos;
      if (evento && evento.cuposTotales != null) {
        // Incrementar en 1, sin exceder los totales
        const reloadedEvento = await queryRunner.manager.findOne(net_eventos, { where: { id: evento.id } });
        if (reloadedEvento) {
          const actuales = reloadedEvento.cuposDisponibles ?? 0;
          const totales = reloadedEvento.cuposTotales ?? 0;
          reloadedEvento.cuposDisponibles = Math.min(totales, actuales + 1);
          await queryRunner.manager.save(net_eventos, reloadedEvento);
        }
      }

      await queryRunner.commitTransaction();
      return { mensaje: 'Inscripción cancelada correctamente', idRegistro: registro.id };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // ==================== HISTORIAL DE CANCELACIONES ====================
  async listarMisCancelacionesDesdeToken(token?: string) {
    const parsed = this.verifyDocenteToken(token);
    if (!parsed) {
      throw new BadRequestException('Token inválido o expirado');
    }
    const docenteId = parsed.docenteId;

    const registros = await this.registroEventoRepository.find({
      where: { docente: { id: docenteId }, estado: { nombreEstado: 'Cancelado' } as any },
      relations: ['evento', 'estado', 'evento.municipio', 'evento.municipio.departamento', 'evento.clase', 'evento.clase.area', 'evento.regional'],
      order: { fechaRegistro: 'DESC' },
    });

    const resultado = [] as any[];
    for (const reg of registros) {
      const invitadosRegistrados = await this.invitadosDocentesRepository.count({ where: { idRegistroEvento: reg.id } });
      const ev: any = reg.evento;
      resultado.push({
        idRegistro: reg.id,
        fechaRegistro: reg.fechaRegistro,
        estado: reg.estado?.nombreEstado ?? 'Sin estado',
        idEstado: reg.estado?.id ?? null,
        invitadosRegistrados,
        evento: {
          id: ev.id,
          nombreEvento: ev.nombreEvento,
          descripcion: ev.descripcion,
          fechaInicio: ev.fechaInicio,
          horaInicio: ev.horaInicio,
          horaFin: ev.horaFin,
          direccion: ev.direccion,
          cuposTotales: ev.cuposTotales,
          cuposDisponibles: ev.cuposDisponibles,
          cantidadInvPermitidos: ev.cantidadInvPermitidos,
          municipio: ev.municipio ? { id: ev.municipio.id, nombres: ev.municipio.nombres } : null,
          departamento: ev.municipio?.departamento ? { id: ev.municipio.departamento.id, nombres: ev.municipio.departamento.nombres } : null,
          clase: ev.clase ? { id: ev.clase.id, nombre: ev.clase.nombre } : null,
          area: ev.clase?.area ? { id: ev.clase.area.id, nombres: ev.clase.area.nombres } : null,
          regional: ev.regional ? { id: ev.regional.id, nombreRegional: ev.regional.nombreRegional } : null,
        }
      });
    }

    return resultado;
  }

  private ensureImagenUrl(evento?: net_eventos | null) {
    if (evento && (evento as any).imagenBlob) {
      (evento as any).imagenUrl = `/eventos/imagen/${(evento as any).id}`;
    }
    if (evento) {
      delete (evento as any).imagenBlob;
      delete (evento as any).imagenMime;
    }
    return evento;
  }

  private sanitizeUsuario(usuario?: net_usuario | null) {
    if (!usuario) {
      return null;
    }
    const { contrasena, ...resto } = usuario as any;
    return resto;
  }

  // ==================== MÉTODOS DE AUTENTICACIÓN ====================

  async registrarUsuario(payload: RegistrarUsuarioDto) {
    const correoNormalizado = payload.correoElectronico.trim().toLowerCase();
    const numeroEmpleadoNormalizado = payload.numeroEmpleado.trim();
    const dniNormalizado = payload.dni.trim().toUpperCase();
    const nombreNormalizado = payload.nombre.trim();

    const existeUsuario = await this.usuarioRepository.findOne({
      where: { correoElectronico: correoNormalizado },
    });

    if (existeUsuario) {
      throw new BadRequestException('Ya existe un usuario con ese correo electrónico');
    }

    const area = await this.areasRepository.findOne({ where: { id: payload.idArea } });
    if (!area) {
      throw new NotFoundException(`No existe un área con el ID ${payload.idArea}`);
    }

    let empleado = await this.empleadoRepository.findOne({
      where: [
        { numeroEmpleado: numeroEmpleadoNormalizado },
        { dni: dniNormalizado },
      ],
    });

    if (!empleado) {
      empleado = this.empleadoRepository.create({
        nombre: nombreNormalizado,
        numeroEmpleado: numeroEmpleadoNormalizado,
        dni: dniNormalizado,
        idArea: payload.idArea,
        area,
      });
    } else {
      empleado.nombre = nombreNormalizado;
      empleado.numeroEmpleado = numeroEmpleadoNormalizado;
      empleado.dni = dniNormalizado;
      empleado.idArea = payload.idArea;
      empleado.area = area;
    }

    const empleadoGuardado = await this.empleadoRepository.save(empleado);

    const nuevoUsuario = this.usuarioRepository.create({
      correoElectronico: correoNormalizado,
      contrasena: this.hashPassword(payload.contrasena),
      idEmpleado: empleadoGuardado.id,
      empleado: empleadoGuardado,
    });

    const guardado = await this.usuarioRepository.save(nuevoUsuario);

    const usuarioCompleto = await this.usuarioRepository.findOne({
      where: { id: guardado.id },
      relations: ['empleado', 'empleado.area'],
    });

    return this.sanitizeUsuario(usuarioCompleto);
  }

  async login(payload: LoginUsuarioDto) {
    const correoNormalizado = payload.correoElectronico.trim().toLowerCase();

    const usuario = await this.usuarioRepository.findOne({
      where: { correoElectronico: correoNormalizado },
      relations: ['empleado', 'empleado.area'],
    });

    if (!usuario || !this.verifyPassword(payload.contrasena, usuario.contrasena)) {
      throw new BadRequestException('Credenciales inválidas');
    }

    const eventos = usuario.empleado?.idArea
      ? await this.filtrarEventosPorArea(usuario.empleado.idArea)
      : [];

    return {
      usuario: this.sanitizeUsuario(usuario),
      eventos,
    };
  }

  async solicitarRecuperacionPassword(payload: RecuperarPasswordDto) {
    const correoNormalizado = payload.correoElectronico.trim().toLowerCase();

    const usuario = await this.usuarioRepository.findOne({
      where: { correoElectronico: correoNormalizado },
    });

    if (!usuario) {
      throw new NotFoundException('No se encontró un usuario con ese correo electrónico');
    }

    await this.recuperacionRepository
      .createQueryBuilder()
      .delete()
      .where('"ID_USUARIO" = :id', { id: usuario.id })
      .execute();

    const token = randomBytes(20).toString('hex');
    const expira = new Date(Date.now() + 60 * 60 * 1000);

    const registro = this.recuperacionRepository.create({
      token,
      expira,
      utilizado: 0,
      idUsuario: usuario.id,
      usuario,
    });

    await this.recuperacionRepository.save(registro);

    return {
      mensaje: 'Se generó el token de recuperación. Envíalo por correo al usuario.',
      token,
      expira,
    };
  }

  async restablecerPassword(payload: RestablecerPasswordDto) {
    const registro = await this.recuperacionRepository.findOne({
      where: { token: payload.token },
      relations: ['usuario', 'usuario.empleado', 'usuario.empleado.area'],
    });

    if (!registro || registro.utilizado) {
      throw new NotFoundException('Token de recuperación inválido');
    }

    if (registro.expira.getTime() < Date.now()) {
      await this.recuperacionRepository.delete({ id: registro.id });
      throw new BadRequestException('El token de recuperación ha expirado');
    }

    registro.usuario.contrasena = this.hashPassword(payload.nuevaContrasena);
    await this.usuarioRepository.save(registro.usuario);

    registro.utilizado = 1;
    await this.recuperacionRepository.save(registro);

    return { mensaje: 'Contraseña actualizada correctamente' };
  }

  async cambiarPassword(payload: CambiarPasswordDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: payload.idUsuario },
      relations: ['empleado', 'empleado.area'],
    });

    if (!usuario) {
      throw new NotFoundException(`No existe un usuario con el ID ${payload.idUsuario}`);
    }

    if (!this.verifyPassword(payload.contrasenaActual, usuario.contrasena)) {
      throw new BadRequestException('La contraseña actual no es válida');
    }

    usuario.contrasena = this.hashPassword(payload.nuevaContrasena);
    await this.usuarioRepository.save(usuario);

    await this.recuperacionRepository
      .createQueryBuilder()
      .delete()
      .where('"ID_USUARIO" = :id', { id: usuario.id })
      .execute();

    return this.sanitizeUsuario(usuario);
  }

  // ==================== MÉTODOS PARA DOCENTES ====================

  create(createEventoDto: CreateEventoDto) {
    return 'This action adds a new evento';
  }

  // Buscar todos los docentes
  BuscarRegistro() {
    return this.netDocenteRepository.find();
  }

  // Buscar docente por identificación (DNI)
  async findByIdentificacion(identificacion: string) {
    const docente = await this.netDocenteRepository.findOne({
      where: { nIdentificacion: identificacion },
      relations: ['municipioResidencia', 'grupoEtnico', 'registros', 'discapacidades']
    });

    if (!docente) {
      throw new NotFoundException(
        `No existe un docente con la identificación ${identificacion}`,
      );
    }

    return docente;
  }

  // Actualizar docente por IDENTIFICACION (DNI)
  async updateByIdentificacion(identificacion: string, updateData: Partial<net_docentes>) {
    const docente = await this.netDocenteRepository.findOne({ where: { nIdentificacion: identificacion }, relations: ['discapacidades'] });
    if (!docente) {
      throw new NotFoundException(`No existe un docente con la identificación ${identificacion}`);
    }

    const { discapacidadesIds, ...rest } = updateData as any;
    if (discapacidadesIds && Array.isArray(discapacidadesIds)) {
      const nuevas = await this.discapacidadesRepository.find({ where: { id: In(discapacidadesIds) } });
      docente.discapacidades = nuevas;
      await this.netDocenteRepository.save(docente);
    }

    if (Object.keys(rest).length > 0) {
      await this.netDocenteRepository.update(docente.id, rest);
    }
    return this.netDocenteRepository.findOne({ where: { id: docente.id }, relations: ['municipioResidencia', 'grupoEtnico', 'registros', 'discapacidades'] });
  }

  // Actualizar docente por ID
  async updateDocenteById(id: number, updateData: Partial<net_docentes>) {
    const docente = await this.netDocenteRepository.findOne({ where: { id }, relations: ['discapacidades'] });

    if (!docente) {
      throw new NotFoundException(`No existe un docente con el ID ${id}`);
    }

    const { discapacidadesIds, ...rest } = updateData as any;
    if (discapacidadesIds && Array.isArray(discapacidadesIds)) {
      const nuevas = await this.discapacidadesRepository.find({ where: { id: In(discapacidadesIds) } });
      docente.discapacidades = nuevas;
      await this.netDocenteRepository.save(docente);
    }
    if (Object.keys(rest).length > 0) {
      await this.netDocenteRepository.update(id, rest);
    }
    return this.netDocenteRepository.findOne({ where: { id }, relations: ['municipioResidencia', 'grupoEtnico', 'registros', 'discapacidades'] });
  }

  // Buscar docente por ID
  findOne(id: number) {
    return this.netDocenteRepository.findOne({
      where: { id },
      relations: ['municipioResidencia', 'grupoEtnico', 'registros']
    });
  }

  // ==================== MÉTODOS PARA EVENTOS ====================

  // Crear un nuevo evento
  async crearEvento(createEventoDto: CreateEventoFullDto) {
    const dto: any = { ...createEventoDto };

    // Verificar área del usuario contra el área de la clase (control de acceso)
    if (dto.idUsuario && dto.idClase) {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: dto.idUsuario },
        relations: ['empleado'],
      });
      if (!usuario || !usuario.empleado?.idArea) {
        throw new BadRequestException('Usuario inválido o sin área asociada');
      }
      const clase = await this.clasesRepository.findOne({ where: { id: dto.idClase } });
      if (!clase) {
        throw new NotFoundException(`No existe una clase con el ID ${dto.idClase}`);
      }
      if (Number(clase.id_areas) !== Number(usuario.empleado.idArea)) {
        throw new BadRequestException('No puede crear eventos fuera de su área');
      }
    }

    // Transformar fechaInicio - usar mediodía para evitar problemas de zona horaria
    if (dto.fechaInicio && typeof dto.fechaInicio === 'string') {
      const parts = dto.fechaInicio.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        dto.fechaInicio = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T12:00:00`);
      }
    }

    // Transformar fechaFin - usar mediodía para evitar problemas de zona horaria
    if (dto.fechaFin && typeof dto.fechaFin === 'string') {
      const parts = dto.fechaFin.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        dto.fechaFin = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T12:00:00`);
      }
    }

    const imagenData = this.parseBase64Image((dto as any).imagenBase64);
    if (imagenData) {
      (dto as any).imagenBlob = imagenData.buffer;
      (dto as any).imagenMime = imagenData.mime;
    }
    delete (dto as any).imagenBase64;

    const evento = this.eventosRepository.create(dto);
    const guardado: net_eventos = await this.eventosRepository.save(evento as any);

    return this.ensureImagenUrl(guardado);
  }

  // Listar TODOS los eventos
  async listarTodosLosEventos() {
    const eventos = await this.eventosRepository.find({
      relations: ['municipio', 'municipio.departamento', 'clase', 'clase.area', 'regional'],
      order: { fechaInicio: 'DESC' }
    });
    return eventos.map((e) => this.ensureImagenUrl(e));
  }

  // Filtrar eventos por ÁREA
  async filtrarEventosPorArea(idArea: number) {
    const eventos = await this.eventosRepository
      .createQueryBuilder('evento')
      .leftJoinAndSelect('evento.municipio', 'municipio')
      .leftJoinAndSelect('municipio.departamento', 'departamento')
      .leftJoinAndSelect('evento.clase', 'clase')
      .leftJoinAndSelect('clase.area', 'area')
      .leftJoinAndSelect('evento.regional', 'regional')
      .where('area.id = :idArea', { idArea })
      .orderBy('evento.fechaInicio', 'DESC')
      .getMany();
    return eventos.map((e) => this.ensureImagenUrl(e));
  }

  async filtrarEventosPorUsuario(idUsuario: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: idUsuario },
      relations: ['empleado'],
    });

    if (!usuario) {
      throw new NotFoundException(`No existe un usuario con el ID ${idUsuario}`);
    }

    if (!usuario.empleado || !usuario.empleado.idArea) {
      throw new BadRequestException('El usuario no tiene un área asociada para filtrar');
    }

    return this.filtrarEventosPorArea(usuario.empleado.idArea);
  }

  // Buscar evento por ID (para detalles)
  async buscarEventoPorId(id: number) {
    const evento = await this.eventosRepository.findOne({
      where: { id },
      relations: ['municipio', 'municipio.departamento', 'clase', 'clase.area', 'regional', 'registros', 'registros.docente', 'registros.estado']
    });

    if (!evento) {
      throw new NotFoundException(`No existe un evento con el ID ${id}`);
    }

    return this.ensureImagenUrl(evento);
  }

  // Actualizar evento
  async actualizarEvento(id: number, updateData: UpdateEventoFullDto) {
    // Obtener evento directamente sin mapeo (sin imagenUrl)
    const eventoRaw = await this.eventosRepository.findOne({
      where: { id },
      relations: ['municipio', 'municipio.departamento', 'clase', 'clase.area', 'regional', 'registros', 'registros.docente', 'registros.estado']
    });
    
    if (!eventoRaw) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    // Crear un merge de los datos originales con los nuevos (solo actualizar lo que se envía)
    // Usar solo los campos de la entidad, NO incluir imagenUrl del mapeo
    const dto: any = {
      // Mantener valores originales (sin campos mapeados como imagenUrl)
      nombreEvento: eventoRaw.nombreEvento,
      descripcion: eventoRaw.descripcion,
      tipoEvento: eventoRaw.tipoEvento,
      idClase: (eventoRaw as any).idClase,
      diasSemana: eventoRaw.diasSemana,
      idMunicipio: (eventoRaw as any).idMunicipio,
      direccion: eventoRaw.direccion,
      fechaInicio: eventoRaw.fechaInicio,
      fechaFin: eventoRaw.fechaFin,
      horaInicio: eventoRaw.horaInicio,
      horaFin: eventoRaw.horaFin,
      cuposDisponibles: (eventoRaw as any).cuposDisponibles,
      cuposTotales: (eventoRaw as any).cuposTotales,
      idUsuario: (eventoRaw as any).idUsuario,
      idRegional: (eventoRaw as any).idRegional,
      cantidadInvPermitidos: (eventoRaw as any).cantidadInvPermitidos,
      
      // Sobrescribir con datos nuevos si se proporcionan
      ...updateData,
    };

    // Transformar fechas si vienen como string
    // Transformar fechaInicio si existe
    if (dto.fechaInicio && typeof dto.fechaInicio === 'string') {
      const parts = dto.fechaInicio.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        dto.fechaInicio = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T12:00:00`);
      }
    }

    // Transformar fechaFin si existe
    if (dto.fechaFin && typeof dto.fechaFin === 'string') {
      const parts = dto.fechaFin.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        dto.fechaFin = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T12:00:00`);
      }
    }

    // Manejar imagen base64
    const imagenData = this.parseBase64Image((dto as any).imagenBase64);
    if (imagenData) {
      (dto as any).imagenBlob = imagenData.buffer;
      (dto as any).imagenMime = imagenData.mime;
    }
    delete (dto as any).imagenBase64;

    // Limpiar valores undefined y campos que no son columnas de BD
    const fieldNames = ['nombreEvento', 'descripcion', 'tipoEvento', 'idClase', 'diasSemana', 'idMunicipio', 
                        'direccion', 'fechaInicio', 'fechaFin', 'horaInicio', 'horaFin', 'cuposDisponibles',
                        'cuposTotales', 'imagenBlob', 'imagenMime', 'idUsuario', 'idRegional', 'cantidadInvPermitidos'];
    
    Object.keys(dto).forEach(key => {
      if (dto[key] === undefined || !fieldNames.includes(key)) {
        delete dto[key];
      }
    });

    try {
      const resultado = await this.eventosRepository.update(id, dto);
      return this.buscarEventoPorId(id);
    } catch (error: any) {
      console.error('Error actualizando evento:', error);
      
      // Manejo específico de errores de integridad referencial
      if (error.code === 'ORA-02291' || error.message?.includes('ORA-02291')) {
        throw new BadRequestException('Error: Datos relacionados no válidos. Verifique que el municipio, clase y otros datos referenciados existan en la base de datos.');
      }
      
      throw error;
    }
  }

  async obtenerImagenEvento(id: number) {
    const evento = await this.eventosRepository.findOne({ where: { id } });

    if (!evento || !(evento as any).imagenBlob) {
      throw new NotFoundException(`No existe imagen para el evento ${id}`);
    }

    const mime = (evento as any).imagenMime ?? 'image/png';
    return { buffer: (evento as any).imagenBlob as Buffer, mime };
  }

  // ==================== MÉTODOS DE REGISTRO ====================

  async registrarAsistencia(payload: CreateRegistroEventoDto) {
    const { idEvento, idDocente, idEstado, cantidadInvDocente } = payload;
    // Verificar que el evento existe
    const evento = await this.eventosRepository.findOne({ where: { id: idEvento } });
    if (!evento) {
      throw new NotFoundException(`No existe un evento con el ID ${idEvento}`);
    }

    // Verificar que el docente existe
    const docente = await this.netDocenteRepository.findOne({ where: { id: idDocente } });
    if (!docente) {
      throw new NotFoundException(`No existe un docente con el ID ${idDocente}`);
    }

    // Verificar que el estado existe
    const estado = await this.estadosRepository.findOne({ where: { id: idEstado } });
    if (!estado) {
      throw new BadRequestException(`Estado inválido: ID ${idEstado}`);
    }
    // Validar clasificación de estado para docente
    if ((estado as any).clasificacion && (estado as any).clasificacion !== 'DOCENTE') {
      throw new BadRequestException(`El estado ${estado.nombreEstado} no pertenece a la clasificación DOCENTE`);
    }

    // Validar cantidad de invitados del docente contra permitido por evento
    if (typeof cantidadInvDocente === 'number' && typeof (evento as any).cantidadInvPermitidos === 'number') {
      if (cantidadInvDocente > (evento as any).cantidadInvPermitidos) {
        throw new BadRequestException(`Cantidad de invitados (${cantidadInvDocente}) supera el máximo permitido por el evento (${(evento as any).cantidadInvPermitidos})`);
      }
    }

    // Verificar si ya está registrado (opcional, pero recomendado)
    const existeRegistro = await this.registroEventoRepository.findOne({
      where: {
        evento: { id: idEvento },
        docente: { id: idDocente }
      }
    });

    if (existeRegistro) {
      return existeRegistro; // O lanzar una excepción si no se permiten duplicados
    }

    const nuevoRegistro = this.registroEventoRepository.create({
      evento: evento,
      docente: docente,
      estado: estado,
      cantidadInvDocente: cantidadInvDocente,
      fechaRegistro: new Date()
    });

    return await this.registroEventoRepository.save(nuevoRegistro);
  }

  // ==================== MÉTODOS AUXILIARES ====================

  // Listar todos los municipios disponibles
  async listarMunicipios() {
    return await this.municipioRepository.find({
      relations: ['departamento', 'departamento.pais'],
      order: { nombres: 'ASC' }
    });
  }

  async listarMunicipiosPorDepartamento(idDepartamento: number) {
    return await this.municipioRepository.find({
      where: { id_departamento: idDepartamento },
      relations: ['departamento', 'departamento.pais'],
      order: { nombres: 'ASC' }
    });
  }

  // Listar todas las clases disponibles
  async listarClases() {
    return await this.clasesRepository.find({
      relations: ['area'],
      order: { nombre: 'ASC' }
    });
  }

  async listarClasesPorArea(idArea: number) {
    const idAreaNum = Number(idArea);
    if (!Number.isFinite(idAreaNum) || idAreaNum <= 0) {
      throw new BadRequestException('ID de área inválido');
    }

    const area = await this.areasRepository.findOne({ where: { id: idAreaNum } });
    if (!area) {
      // Devolver lista vacía en vez de 500 si el área no existe en BD
      return [];
    }

    try {
      return await this.clasesRepository.find({
        where: { id_areas: idAreaNum },
        relations: ['area'],
        order: { nombre: 'ASC' },
      });
    } catch (error) {
      // Si la consulta falla, evita 500 devolviendo un error controlado
      throw new BadRequestException(`No se pudieron listar clases para el área ${idAreaNum}`);
    }
  }

  // Listar todas las áreas disponibles
  async listarAreas() {
    return await this.areasRepository.find({
      order: { nombres: 'ASC' }
    });
  }

  // Listar todas las regionales
  async listarRegionales() {
    return await this.regionalRepository.find({
      order: { nombres: 'ASC' }
    });
  }

  // ==================== NUEVOS MÉTODOS ====================

  async listarEstadosPorClasificacion(clasificacion: string) {
    return await this.estadosRepository.find({ where: { clasificacion } });
  }

  async listarDepartamentos() {
    return await this.departamentoRepository.find({
      relations: ['pais'],
      order: { nombres: 'ASC' }
    });
  }

  async listarAldeasPorMunicipio(idMunicipio: number) {
    return await this.aldeaRepository.find({
      where: { idMunicipio },
      order: { nombreAldea: 'ASC' }
    });
  }

  // Listar TODAS las aldeas con sus relaciones
  async listarTodasLasAldeas() {
    return await this.aldeaRepository.find({
      relations: ['municipio', 'municipio.departamento'],
      order: { nombreAldea: 'ASC' }
    });
  }

  // ==================== MÉTODOS CARNETIZACIÓN PASO 1 ====================

  /**
   * Buscar docente por DNI (N_IDENTIFICACION)
   */
  async buscarDocentePorDni(dni: string) {
    const docente = await this.netDocenteRepository.findOne({
      where: { nIdentificacion: dni },
      relations: [
        'municipioResidencia',
        'municipioResidencia.departamento',
        'grupoEtnico',
        'aldea',
        'aldea.municipio',
        'aldea.municipio.departamento',
      ],
    });

    if (!docente) {
      throw new NotFoundException(`No existe un docente con DNI ${dni}`);
    }

    return this.mapDocenteResponse(docente);
  }

  /**
   * Actualizar datos personales del docente (paso 1)
   */
  async actualizarDocentePaso1(id: number, updateData: any) {
    const docente = await this.netDocenteRepository.findOne({
      where: { id },
      relations: [
        'municipioResidencia',
        'municipioResidencia.departamento',
        'grupoEtnico',
        'aldea',
        'aldea.municipio',
        'aldea.municipio.departamento',
      ],
    });

    if (!docente) {
      throw new NotFoundException(`No existe un docente con ID ${id}`);
    }

    // Actualizar campos
    if (updateData.primerNombre) docente.primerNombre = updateData.primerNombre;
    if (updateData.segundoNombre !== undefined) docente.segundoNombre = updateData.segundoNombre || undefined;
    if (updateData.tercerNombre !== undefined) docente.tercerNombre = updateData.tercerNombre || undefined;
    if (updateData.primerApellido) docente.primerApellido = updateData.primerApellido;
    if (updateData.segundoApellido !== undefined) docente.segundoApellido = updateData.segundoApellido || undefined;
    if (updateData.genero !== undefined) docente.genero = updateData.genero;
    if (updateData.fechaNacimiento !== undefined) docente.fechaNacimiento = updateData.fechaNacimiento ? new Date(updateData.fechaNacimiento) : undefined;
    if (updateData.telefono1 !== undefined) docente.telefono1 = updateData.telefono1;
    if (updateData.direccionResidencia !== undefined) docente.direccionResidencia = updateData.direccionResidencia;
    if (updateData.idMunicipio !== undefined) docente.idMunicipioResidencia = updateData.idMunicipio;
    if (updateData.idAldea !== undefined) docente.idAldea = updateData.idAldea;
    if (updateData.idGrupoEtnico !== undefined) docente.idGrupoEtnico = updateData.idGrupoEtnico;

    const actualizado = await this.netDocenteRepository.save(docente);
    const reloadedDocente = await this.netDocenteRepository.findOne({
      where: { id },
      relations: ['municipioResidencia', 'grupoEtnico', 'aldea'],
    });

    if (!reloadedDocente) {
      throw new NotFoundException(`No existe un docente con ID ${id}`);
    }

    return this.mapDocenteResponse(reloadedDocente);
  }

  /**
   * Mapear entidad a DTO de respuesta
   */
  private mapDocenteResponse(docente: net_docentes) {
    return {
      id: docente.id,
      nIdentificacion: docente.nIdentificacion,
      primerNombre: docente.primerNombre,
      segundoNombre: docente.segundoNombre,
      tercerNombre: docente.tercerNombre,
      primerApellido: docente.primerApellido,
      segundoApellido: docente.segundoApellido,
      genero: docente.genero,
      fechaNacimiento: docente.fechaNacimiento,
      telefono1: docente.telefono1,
      direccionResidencia: docente.direccionResidencia,
      // Para precarga en frontend necesitamos ambos IDs en cascada
      idDepartamento:
        docente.municipioResidencia?.id_departamento ||
        docente.aldea?.municipio?.id_departamento,
      idMunicipioResidencia:
        docente.idMunicipioResidencia || docente.aldea?.idMunicipio,
      idAldea: docente.idAldea,
      idGrupoEtnico: docente.idGrupoEtnico,
      municipio: docente.municipioResidencia
        ? { id: docente.municipioResidencia.id, nombres: docente.municipioResidencia.nombres }
        : undefined,
      aldea: docente.aldea
        ? {
            id: docente.aldea.id,
            nombreAldea: docente.aldea.nombreAldea,
            idMunicipio: docente.aldea.idMunicipio,
          }
        : undefined,
      grupoEtnico: docente.grupoEtnico
        ? { id: docente.grupoEtnico.id, nombre: docente.grupoEtnico.nombreGrupoEtnico }
        : undefined,
    };
  }

  // Listar grupos étnicos
  async listarGruposEtnicos() {
    return await this.grupoEtnicoRepository.find({
      select: ['id', 'nombreGrupoEtnico'],
      order: { nombreGrupoEtnico: 'ASC' },
    });
  }

  // Listar discapacidades
  async listarDiscapacidades() {
    return await this.discapacidadesRepository.find({
      select: ['id', 'nombre', 'descripcion'],
      order: { nombre: 'ASC' },
    });
  }

  // Obtener discapacidades del docente
  async obtenerDiscapacidadesDocente(idDocente: number) {
    return await this.docenteDiscapacidadesRepository.find({
      where: { idPersona: idDocente },
      relations: ['discapacidad'],
    });
  }

  // Inscripción completa a evento (con transacción)
  /**
   * 🔍 Verificar estado de inscripción del docente en un evento
   * Retorna información completa del estado actual
   */
  async verificarEstadoInscripcion(idEvento: number, idDocente: number) {
    const registro = await this.registroEventoRepository.findOne({
      where: {
        evento: { id: idEvento },
        docente: { id: idDocente },
      },
      relations: ['estado', 'evento'],
    });

    if (!registro) {
      return {
        estaInscrito: false,
        mensaje: 'El docente no está inscrito en este evento',
      };
    }

    // Contar invitados registrados
    const invitadosRegistrados = await this.invitadosDocentesRepository.count({
      where: { idRegistroEvento: registro.id },
    });

    const evento = registro.evento;
    const maxInvitados = (evento as any).cantidadInvPermitidos || 0;
    const invitadosFaltantes = Math.max(0, maxInvitados - invitadosRegistrados);

    return {
      estaInscrito: true,
      idRegistro: registro.id,
      estado: registro.estado?.nombreEstado || 'Sin estado',
      idEstado: registro.estado?.id,
      fechaRegistro: registro.fechaRegistro,
      invitadosRegistrados,
      maxInvitados,
      invitadosFaltantes,
      puedeAgregarInvitados: invitadosFaltantes > 0,
      mensaje: invitadosFaltantes > 0 
        ? `Puede registrar ${invitadosFaltantes} invitado(s) más` 
        : 'Ya completó su cupo de invitados',
    };
  }

  /**
   * ➕ Agregar invitados a una inscripción existente
   * Solo permite agregar los que faltan hasta el máximo permitido
   */
  async agregarInvitadosAInscripcion(dto: {
    idEvento: number;
    idDocente: number;
    invitados: { dniInvitado: string; nombreInvitado: string }[];
  }) {
    const { idEvento, idDocente, invitados } = dto;

    // 1. Validar que el docente esté inscrito
    const registro = await this.registroEventoRepository.findOne({
      where: {
        evento: { id: idEvento },
        docente: { id: idDocente },
      },
      relations: ['evento'],
    });

    if (!registro) {
      throw new BadRequestException('El docente no está inscrito en este evento. Debe inscribirse primero.');
    }

    // 2. Obtener evento y validar que permite invitados
    const evento = registro.evento;
    const maxInvitados = (evento as any).cantidadInvPermitidos || 0;

    if (maxInvitados === 0) {
      throw new BadRequestException('Este evento no permite invitados');
    }

    // 3. Contar invitados actuales del docente en este evento
    const invitadosActuales = await this.invitadosDocentesRepository.count({
      where: { idRegistroEvento: registro.id },
    });

    const espacioDisponible = maxInvitados - invitadosActuales;

    if (espacioDisponible <= 0) {
      throw new BadRequestException(`Ya completó su cupo de ${maxInvitados} invitados`);
    }

    // 4. Validar que no intente agregar más de los que le quedan
    const cantidadNuevos = invitados?.length || 0;
    if (cantidadNuevos > espacioDisponible) {
      throw new BadRequestException(
        `Solo puede agregar ${espacioDisponible} invitado(s) más. Actualmente tiene ${invitadosActuales} de ${maxInvitados}`
      );
    }

    // 5. Guardar nuevos invitados en transacción
    const queryRunner = this.registroEventoRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let agregados = 0;
      for (const inv of invitados) {
        const nuevoInvitado = queryRunner.manager.create(net_invitados_docentes, {
          idRegistroEvento: registro.id,
          dniInvitado: inv.dniInvitado,
          nombreInvitado: inv.nombreInvitado,
        });
        await queryRunner.manager.save(net_invitados_docentes, nuevoInvitado);
        agregados++;
      }

      // Actualizar cantidad de invitados en el registro
      registro.cantidadInvDocente = invitadosActuales + agregados;
      await queryRunner.manager.save(registro_evento, registro);

      await queryRunner.commitTransaction();

      return {
        mensaje: `Se agregaron ${agregados} invitado(s) exitosamente`,
        invitadosActuales: invitadosActuales + agregados,
        maxInvitados,
        espacioRestante: maxInvitados - (invitadosActuales + agregados),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async inscribirDocenteEvento(dto: any) {
    const { idEvento, idDocente, tieneDiscapacidad, idsDiscapacidades, llevaInvitados, invitados } = dto;

    // 1. Validar que el evento existe
    const evento = await this.eventosRepository.findOne({
      where: { id: idEvento },
    });

    if (!evento) {
      throw new NotFoundException(`Evento con ID ${idEvento} no encontrado`);
    }

    // 2. Validar que el docente existe
    const docente = await this.netDocenteRepository.findOne({
      where: { id: idDocente },
    });

    if (!docente) {
      throw new NotFoundException(`Docente con ID ${idDocente} no encontrado`);
    }

    // 3. Validar que no esté ya inscrito (OBLIGATORIO - NO permitir duplicados)
    const registroExistente = await this.registroEventoRepository.findOne({
      where: {
        docente: { id: idDocente },
        evento: { id: idEvento },
      },
      relations: ['estado'],
    });

    if (registroExistente) {
      throw new BadRequestException(
        `El docente ya está inscrito en este evento. Estado actual: ${registroExistente.estado?.nombreEstado || 'Sin estado'}`
      );
    }

    // 4. Validar cupos disponibles
    const cuposOcupados = await this.registroEventoRepository.count({
      where: { evento: { id: idEvento } },
    });

    if (evento.cuposTotales && cuposOcupados >= evento.cuposTotales) {
      throw new BadRequestException('No hay cupos disponibles para este evento');
    }

    // 5. Validar cantidad de invitados
    const cantidadInvitados = invitados?.length || 0;
    if (llevaInvitados && cantidadInvitados > 0) {
      const maxInvitados = evento.cantidadInvPermitidos || 0;
      if (maxInvitados === 0) {
        throw new BadRequestException('Este evento no permite invitados');
      }
      if (cantidadInvitados > maxInvitados) {
        throw new BadRequestException(`Solo se permiten hasta ${maxInvitados} invitados por docente`);
      }
    }

    // 6. Iniciar transacción
    const queryRunner = this.registroEventoRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 7. Crear registro de evento
      const estadoInscrito = await queryRunner.manager.findOne(net_estados, {
        where: { id: 4 }, // 4 = Inscrito
      });

      const nuevoRegistro = queryRunner.manager.create(registro_evento, {
        evento: evento,
        docente: docente,
        fechaRegistro: new Date(),
        cantidadInvDocente: cantidadInvitados,
        estado: estadoInscrito || undefined,
      });

      const registroGuardado = await queryRunner.manager.save(registro_evento, nuevoRegistro);

      // 8. Guardar discapacidades si tiene
      let discapacidadesRegistradas = 0;
      if (tieneDiscapacidad && idsDiscapacidades && idsDiscapacidades.length > 0) {
        // Eliminar discapacidades previas del docente
        await queryRunner.manager.delete(net_docente_discapacidades, {
          idPersona: idDocente,
        });

        // Insertar nuevas discapacidades
        for (const idDiscapacidad of idsDiscapacidades) {
          const nuevaDiscapacidad = queryRunner.manager.create(net_docente_discapacidades, {
            idPersona: idDocente,
            idDiscapacidad: idDiscapacidad,
          });
          await queryRunner.manager.save(net_docente_discapacidades, nuevaDiscapacidad);
          discapacidadesRegistradas++;
        }
      } else {
        // Si no tiene discapacidades, eliminar las existentes
        await queryRunner.manager.delete(net_docente_discapacidades, {
          idPersona: idDocente,
        });
      }

      // 9. Guardar invitados si lleva
      if (llevaInvitados && invitados && invitados.length > 0) {
        for (const invitado of invitados) {
          const nuevoInvitado = queryRunner.manager.create(net_invitados_docentes, {
            idRegistroEvento: registroGuardado.id,
            dniInvitado: invitado.dniInvitado,
            nombreInvitado: invitado.nombreInvitado,
          });
          await queryRunner.manager.save(net_invitados_docentes, nuevoInvitado);
        }
      }

      // 10. Actualizar cupos disponibles
      if (evento.cuposTotales && evento.cuposDisponibles !== null) {
        evento.cuposDisponibles = evento.cuposTotales - (cuposOcupados + 1);
        await queryRunner.manager.save(net_eventos, evento);
      }

      // 11. Commit de la transacción
      await queryRunner.commitTransaction();

      return {
        idRegistro: registroGuardado.id,
        mensaje: 'Inscripción completada exitosamente',
        cuposRestantes: evento.cuposDisponibles || 0,
        cantidadInvitados: cantidadInvitados,
        discapacidadesRegistradas: discapacidadesRegistradas,
      };

    } catch (error) {
      // Rollback en caso de error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar el query runner
      await queryRunner.release();
    }
  }

}
