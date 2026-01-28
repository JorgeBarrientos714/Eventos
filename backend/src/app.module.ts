import 'dotenv/config';
import { Module } from '@nestjs/common';
import { EventosModule } from './modulos/eventos/eventos.module';
import { TypeOrmModule } from '@nestjs/typeorm';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      // Usa exactamente el connect string provisto en .env para evitar discrepancias de servicio/SID
      connectString: process.env.CONNECT_STRING,
      autoLoadEntities: true, // 👈 carga todas las entities registradas en los módulos
      synchronize: false, // 👈 evita DDL automático que intenta tocar columnas internas (SYS_NC...)
      logging: false,
    }),
    EventosModule,
  ],
})
export class AppModule { }



/* @Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'oracle',
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE_NAME}`,
      autoLoadEntities: true, // 👈 carga todas las entities registradas en los módulos
      synchronize: false, // 👈 evita DDL automático que intenta tocar columnas internas (SYS_NC...)
      logging: false,
    }),
    EventosModule,
  ],
})
export class AppModule { }
*/