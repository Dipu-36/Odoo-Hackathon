import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePayrollDto } from './dto/update-payroll.dto';

@Injectable()
export class PayrollService {
  constructor(private readonly prisma: PrismaService) {}

  private mapPayroll(p: any) {
    return {
      ...p,
      basicSalary: Number(p.basicSalary),
      allowances: Number(p.allowances),
      deductions: Number(p.deductions),
      netSalary: Number(p.netSalary),
    };
  }

  async findAll(month?: string) {
    const where: Record<string, unknown> = {};
    if (month) where.month = month;

    const records = await this.prisma.payroll.findMany({ where });
    return records.map((p) => this.mapPayroll(p));
  }

  async findMine(userId: string, month?: string) {
    const where: Record<string, unknown> = { userId };
    if (month) where.month = month;

    const records = await this.prisma.payroll.findMany({ where });
    return records.map((p) => this.mapPayroll(p));
  }

  async findByEmployee(employeeId: string, month?: string) {
    const where: Record<string, unknown> = { userId: employeeId };
    if (month) where.month = month;

    const records = await this.prisma.payroll.findMany({ where });
    return records.map((p) => this.mapPayroll(p));
  }

  async update(employeeId: string, dto: UpdatePayrollDto) {
    const record = await this.prisma.payroll.upsert({
      where: {
        userId_month: { userId: employeeId, month: dto.month },
      },
      update: {
        basicSalary: dto.basicSalary,
        allowances: dto.allowances,
        deductions: dto.deductions,
        netSalary: dto.netSalary,
      },
      create: {
        userId: employeeId,
        month: dto.month,
        basicSalary: dto.basicSalary,
        allowances: dto.allowances,
        deductions: dto.deductions,
        netSalary: dto.netSalary,
      },
    });

    return this.mapPayroll(record);
  }
}
