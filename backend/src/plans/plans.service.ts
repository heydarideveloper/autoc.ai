import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.plan.findMany({
      include: {
        planFeatures: {
          include: { feature: true },
        },
      },
      orderBy: { price: 'asc' },
    });
  }

  async findByIdOrFail(planId: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
      include: {
        planFeatures: {
          include: { feature: true },
        },
      },
    });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    return plan;
  }
}
