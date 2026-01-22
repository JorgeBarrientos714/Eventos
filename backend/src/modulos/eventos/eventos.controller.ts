import { Controller, Get, Post, Body, Patch, Param, Res, Headers } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateDocenteDto, CreateEventoFullDto, UpdateEventoFullDto } from './dto/update-evento.dto';
import { CreateRegistroEventoDto } from './dto/create-registro-evento.dto';
import { InscripcionEventoDto } from './dto/inscripcion-evento.dto';
import { IniciarDocenteDto } from './dto/iniciar-docente.dto';
import { CancelarInscripcionDto } from './dto/cancelar-inscripcion.dto';
import { AgregarInvitadosDto } from './dto/agregar-invitados.dto';
import { RegistrarUsuarioDto, LoginUsuarioDto, RecuperarPasswordDto, RestablecerPasswordDto, CambiarPasswordDto } from './dto/auth.dto';
import type { Response } from 'express';


@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) { }

  // ==================== ENDPOINTS DE AUTENTICACIÓN ====================

  @Post('auth/register')
  registrarUsuario(@Body() payload: RegistrarUsuarioDto) {
    return this.eventosService.registrarUsuario(payload);
  }

  @Post('auth/login')
  login(@Body() payload: LoginUsuarioDto) {
    return this.eventosService.login(payload);
  }

  @Post('auth/recuperar')
  solicitarRecuperacion(@Body() payload: RecuperarPasswordDto) {
    return this.eventosService.solicitarRecuperacionPassword(payload);
  }

  @Post('auth/restablecer')
  restablecerPassword(@Body() payload: RestablecerPasswordDto) {
    return this.eventosService.restablecerPassword(payload);
  }

  @Post('auth/cambiar')
  cambiarPassword(@Body() payload: CambiarPasswordDto) {
    return this.eventosService.cambiarPassword(payload);
  }

  // ==================== ENDPOINTS PARA DOCENTES ====================

  // Iniciar sesión ligera de docente por DNI
  @Post('auth/docente/iniciar')
  iniciarSesionDocente(@Body() dto: IniciarDocenteDto) {
    return this.eventosService.iniciarSesionDocente(dto.dni);
  }

  // Obtener docente actual desde token (Authorization: Bearer <token>)
  @Get('auth/docente/me')
  docenteActual(@Headers('authorization') auth?: string) {
    const token = auth?.startsWith('Bearer ') ? auth.substring(7) : auth;
    return this.eventosService.docenteActualDesdeToken(token);
  }

  // Listar mis inscripciones (usa Authorization: Bearer <token>)
  @Get('mis-inscripciones')
  misInscripciones(@Headers('authorization') auth?: string) {
    const token = auth?.startsWith('Bearer ') ? auth.substring(7) : auth;
    return this.eventosService.listarMisInscripcionesDesdeToken(token);
  }

  // Listar mis cancelaciones (usa Authorization: Bearer <token>)
  @Get('mis-cancelaciones')
  misCancelaciones(@Headers('authorization') auth?: string) {
    const token = auth?.startsWith('Bearer ') ? auth.substring(7) : auth;
    return this.eventosService.listarMisCancelacionesDesdeToken(token);
  }

  @Post()
  create(@Body() createEventoDto: CreateEventoDto) {
    return this.eventosService.create(createEventoDto);
  }

  // Buscar todos los docentes
  @Get('docentes/todos')
  findAll() {
    return this.eventosService.BuscarRegistro();
  }

  // Buscar docente por identificación (DNI)
  @Get('docente/:identificacion')
  findByIdentificacion(@Param('identificacion') identificacion: string) {
    return this.eventosService.findByIdentificacion(identificacion);
  }

  // Actualizar docente por IDENTIFICACION (DNI)
  @Patch('docente/dni/:identificacion')
  updateDocenteByIdentificacion(
    @Param('identificacion') identificacion: string,
    @Body() updateData: UpdateDocenteDto,
  ) {
    return this.eventosService.updateByIdentificacion(identificacion, updateData);
  }

  // Actualizar docente por ID
  @Patch('docente/id/:id')
  updateDocenteById(
    @Param('id') id: string,
    @Body() updateData: UpdateDocenteDto,
  ) {
    return this.eventosService.updateDocenteById(+id, updateData);
  }

  // ==================== ENDPOINTS PARA EVENTOS ====================

  // Crear evento
  @Post('evento')
  crearEvento(@Body() createEventoDto: CreateEventoFullDto) {
    return this.eventosService.crearEvento(createEventoDto);
  }

  // Listar TODOS los eventos
  @Get('evento/todos')
  listarTodosLosEventos() {
    return this.eventosService.listarTodosLosEventos();
  }

  // Filtrar eventos por ÁREA
  @Get('evento/area/:idArea')
  filtrarEventosPorArea(@Param('idArea') idArea: string) {
    return this.eventosService.filtrarEventosPorArea(+idArea);
  }

  // Filtrar eventos por USUARIO (usa el área del empleado asociado)
  @Get('evento/usuario/:idUsuario')
  filtrarEventosPorUsuario(@Param('idUsuario') idUsuario: string) {
    return this.eventosService.filtrarEventosPorUsuario(+idUsuario);
  }

  // Buscar evento por ID (para ver detalles)
  @Get('evento/:id')
  buscarEventoPorId(@Param('id') id: string) {
    return this.eventosService.buscarEventoPorId(+id);
  }

  // Actualizar evento
  @Patch('evento/:id')
  actualizarEvento(
    @Param('id') id: string,
    @Body() updateData: UpdateEventoFullDto,
  ) {
    return this.eventosService.actualizarEvento(+id, updateData);
  }

  // Obtener imagen de evento desde BLOB
  @Get('imagen/:id')
  async obtenerImagen(@Param('id') id: string, @Res() res: Response) {
    const { buffer, mime } = await this.eventosService.obtenerImagenEvento(+id);
    res.setHeader('Content-Type', mime);
    res.send(buffer);
  }

  // ==================== ENDPOINTS AUXILIARES ====================

  // Listar municipios disponibles
  @Get('municipios')
  listarMunicipios() {
    return this.eventosService.listarMunicipios();
  }

  // Listar municipios por departamento
  @Get('municipios/departamento/:idDepartamento')
  listarMunicipiosPorDepartamento(@Param('idDepartamento') idDepartamento: string) {
    return this.eventosService.listarMunicipiosPorDepartamento(+idDepartamento);
  }

  // Listar clases disponibles
  @Get('clases')
  listarClases() {
    return this.eventosService.listarClases();
  }

  // Listar clases por área
  @Get('clases/area/:idArea')
  listarClasesPorArea(@Param('idArea') idArea: string) {
    return this.eventosService.listarClasesPorArea(Number(idArea));
  }

  // Listar áreas disponibles
  @Get('areas')
  listarAreas() {
    return this.eventosService.listarAreas();
  }

  // Listar regionales disponibles
  @Get('regionales')
  listarRegionales() {
    return this.eventosService.listarRegionales();
  }

  // ==================== ENDPOINTS DE REGISTRO ====================

  @Post('registro')
  registrarAsistencia(@Body() createRegistroEventoDto: CreateRegistroEventoDto) {
    return this.eventosService.registrarAsistencia(createRegistroEventoDto);
  }

  // ==================== ENDPOINTS NUEVOS ====================

  // Listar estados por clasificación (EVENTO o DOCENTE)
  @Get('estados/:clasificacion')
  listarEstadosPorClasificacion(@Param('clasificacion') clasificacion: string) {
    return this.eventosService.listarEstadosPorClasificacion(clasificacion);
  }

  // Listar departamentos (con país)
  @Get('departamentos')
  listarDepartamentos() {
    return this.eventosService.listarDepartamentos();
  }

  // Listar todas las aldeas
  @Get('aldeas')
  listarTodasLasAldeas() {
    return this.eventosService.listarTodasLasAldeas();
  }

  // Listar aldeas por municipio
  @Get('aldeas/municipio/:idMunicipio')
  listarAldeasPorMunicipio(@Param('idMunicipio') idMunicipio: string) {
    return this.eventosService.listarAldeasPorMunicipio(+idMunicipio);
  }

  // Listar grupos étnicos
  @Get('grupos-etnicos')
  listarGruposEtnicos() {
    return this.eventosService.listarGruposEtnicos();
  }

  // ==================== ENDPOINTS CARNETIZACIÓN PASO 1 ====================

  // Buscar docente por DNI
  @Get('carnetizacion/docente/dni/:dni')
  buscarDocentePorDni(@Param('dni') dni: string) {
    return this.eventosService.buscarDocentePorDni(dni);
  }

  // Actualizar datos personales del docente (paso 1)
  @Patch('carnetizacion/docente/:id')
  actualizarDocentePaso1(
    @Param('id') id: string,
    @Body() updateData: any,
  ) {
    return this.eventosService.actualizarDocentePaso1(+id, updateData);
  }

  // ==================== ENDPOINTS INSCRIPCIÓN A EVENTOS (PASO 2) ====================

  // Listar discapacidades
  @Get('discapacidades')
  listarDiscapacidades() {
    return this.eventosService.listarDiscapacidades();
  }

  // Obtener discapacidades del docente
  @Get('docente/:idDocente/discapacidades')
  obtenerDiscapacidadesDocente(@Param('idDocente') idDocente: string) {
    return this.eventosService.obtenerDiscapacidadesDocente(+idDocente);
  }

  // 🔍 Verificar estado de inscripción del docente en un evento
  @Get('evento/:idEvento/docente/:idDocente/estado')
  verificarEstadoInscripcion(
    @Param('idEvento') idEvento: string,
    @Param('idDocente') idDocente: string
  ) {
    return this.eventosService.verificarEstadoInscripcion(+idEvento, +idDocente);
  }

  // Inscribir docente a evento con discapacidades e invitados
  @Post('inscripcion')
  inscribirDocenteEvento(@Body() dto: InscripcionEventoDto) {
    return this.eventosService.inscribirDocenteEvento(dto);
  }

  // ➕ Agregar invitados a una inscripción existente
  @Post('inscripcion/agregar-invitados')
  agregarInvitadosAInscripcion(@Body() dto: AgregarInvitadosDto) {
    return this.eventosService.agregarInvitadosAInscripcion(dto);
  }

  // ❌ Cancelar inscripción del docente autenticado (token)
  @Post('inscripcion/cancelar')
  cancelarInscripcion(
    @Headers('authorization') auth: string | undefined,
    @Body() dto: CancelarInscripcionDto,
  ) {
    const token = auth?.startsWith('Bearer ') ? auth.substring(7) : auth;
    return this.eventosService.cancelarInscripcionDesdeToken(token, dto);
  }

}