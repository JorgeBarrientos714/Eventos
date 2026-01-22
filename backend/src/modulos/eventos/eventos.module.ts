import { Module } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { net_docentes } from './entities/net_docentes.entity';
import { net_municipio } from './entities/net_municipio.entity';
import { net_departamento } from './entities/net_departamento.entity';
import { net_areas } from './entities/net_areas.entity';
import { net_clases } from './entities/net_clases.entity';
import { net_eventos } from './entities/net_eventos.entity';
import { net_regional } from './entities/net_regional.entity';
import { registro_evento } from './entities/net_registro_evento.entity';
import { net_grupo_etnico } from './entities/net_grupo_etnico.entity';
import { net_tipo_identificacion } from './entities/net_tipo_identificacion.entity';
import { net_pais } from './entities/net_pais.entity';
import { net_colonia } from './entities/net_colonia.entity';
import { net_aldea } from './entities/net_aldea.entity';
import { net_estados } from './entities/net_estados.entity';
import { net_discapacidades } from './entities/net_discapacidades.entity';
import { net_docente_discapacidades } from './entities/net_docente_discapacidades.entity';
import { net_invitados_docentes } from './entities/net_invitados_docentes.entity';
import { net_empleado } from './entities/net_empleado.entity';
import { net_usuario } from './entities/net_usuario.entity';
import { net_usuario_recuperacion } from './entities/net_usuario_recuperacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([net_docentes, net_municipio, net_departamento,
    net_areas, net_clases, net_eventos, net_regional, registro_evento, net_grupo_etnico,
    net_tipo_identificacion, net_pais, net_colonia, net_aldea, net_estados, net_discapacidades, net_docente_discapacidades,
    net_invitados_docentes, net_empleado, net_usuario, net_usuario_recuperacion])],
  controllers: [EventosController],
  providers: [EventosService],
})
export class EventosModule { }
