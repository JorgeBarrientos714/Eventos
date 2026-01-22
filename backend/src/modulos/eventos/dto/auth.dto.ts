import { IsEmail, IsInt, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class RegistrarUsuarioDto {
  @IsEmail({}, { message: 'Debes proporcionar un correo electrónico válido.' })
  @MaxLength(150)
  correoElectronico: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @MaxLength(200)
  contrasena: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del empleado es obligatorio.' })
  @MaxLength(150)
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'Debes indicar el número de empleado.' })
  @MaxLength(40)
  numeroEmpleado: string;

  @IsString()
  @Matches(/^[0-9A-Za-z-]+$/, { message: 'El DNI solo puede contener números, letras o guiones.' })
  @MaxLength(20)
  dni: string;

  @Type(() => Number)
  @IsInt({ message: 'El identificador del área debe ser numérico.' })
  idArea: number;
}

export class LoginUsuarioDto {
  @IsEmail({}, { message: 'Debes proporcionar un correo electrónico válido.' })
  correoElectronico: string;

  @IsString()
  @IsNotEmpty({ message: 'Debes ingresar la contraseña.' })
  contrasena: string;
}

export class RecuperarPasswordDto {
  @IsEmail({}, { message: 'Debes proporcionar un correo electrónico válido.' })
  correoElectronico: string;
}

export class RestablecerPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Debes proporcionar el token de recuperación.' })
  token: string;

  @IsString()
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres.' })
  @MaxLength(200)
  nuevaContrasena: string;
}

export class CambiarPasswordDto {
  @Type(() => Number)
  @IsInt({ message: 'El identificador del usuario debe ser numérico.' })
  idUsuario: number;

  @IsString()
  @IsNotEmpty({ message: 'Debes indicar la contraseña actual.' })
  contrasenaActual: string;

  @IsString()
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres.' })
  @MaxLength(200)
  nuevaContrasena: string;
}
