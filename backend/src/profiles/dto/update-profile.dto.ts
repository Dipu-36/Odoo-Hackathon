import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ required: false, example: 'John' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false, example: 'Doe' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false, example: '+1 555-0100' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false, example: 'Engineering' })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({ required: false, example: 'Senior Developer' })
  @IsString()
  @IsOptional()
  designation?: string;

  @ApiProperty({ required: false, example: 'https://res.cloudinary.com/...' })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
