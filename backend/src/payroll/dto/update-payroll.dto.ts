import {
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePayrollDto {
  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  basicSalary: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(0)
  allowances: number;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  deductions: number;

  @ApiProperty({ example: 5500 })
  @IsNumber()
  @Min(0)
  netSalary: number;

  @ApiProperty({ example: '2026-07' })
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'month must be in YYYY-MM format' })
  month: string;
}
