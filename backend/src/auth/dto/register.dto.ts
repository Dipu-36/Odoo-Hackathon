import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum Role {
  ADMIN = 'ADMIN',
  HR = 'HR',
  EMPLOYEE = 'EMPLOYEE',
}

export class RegisterDto {
  @ApiProperty({ example: 'EMP-001' })
  @IsString()
  employeeId: string;

  @ApiProperty({ example: 'alice@company.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Str0ng!Pass' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @ApiProperty({ enum: Role, example: Role.EMPLOYEE })
  @IsEnum(Role, { message: 'Role must be ADMIN, HR, or EMPLOYEE' })
  role: Role;
}
