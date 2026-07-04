import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        employeeId: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }

  async create(data: {
    employeeId: string;
    email: string;
    password: string;
    role: 'ADMIN' | 'HR' | 'EMPLOYEE';
    isVerified?: boolean;
  }) {
    return this.prisma.user.create({ data });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        employeeId: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });
  }
}
