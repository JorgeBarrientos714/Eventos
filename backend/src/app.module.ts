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
      connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE_NAME}`,
      autoLoadEntities: true, // 👈 carga todas las entities registradas en los módulos
      synchronize: false, // 👈 evita DDL automático que intenta tocar columnas internas (SYS_NC...)
      logging: true,
    }),
    EventosModule, 
  ],
})
export class AppModule {}