import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        employeeId: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        profile: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return { user, profile: user.profile };
  }

  async updateMyProfile(userId: string, dto: UpdateProfileDto) {
    const existing = await this.prisma.employeeProfile.findUnique({
      where: { userId },
    });

    if (existing) {
      const profile = await this.prisma.employeeProfile.update({
        where: { userId },
        data: dto,
      });
      return { profile };
    }

    const profile = await this.prisma.employeeProfile.create({
      data: {
        userId,
        firstName: dto.firstName ?? '',
        lastName: dto.lastName ?? '',
        phone: dto.phone,
        department: dto.department,
        designation: dto.designation,
        avatarUrl: dto.avatarUrl,
      },
    });

    return { profile };
  }
}
