import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByPhone(phone: string) {
    return this.prisma.user.findUnique({
      where: { phone },
      include: {
        subscription: {
          include: {
            plan: {
              include: {
                planFeatures: {
                  include: { feature: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async findByIdOrFail(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(phone: string, passwordHash: string, isAdmin = false) {
    return this.prisma.user.create({
      data: {
        phone,
        passwordHash,
        isAdmin,
      },
    });
  }

  listAllUsers() {
    return this.prisma.user.findMany({
      include: {
        subscription: {
          include: {
            plan: {
              include: {
                planFeatures: {
                  include: { feature: true },
                },
              },
            },
          },
        },
        feedbacks: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
