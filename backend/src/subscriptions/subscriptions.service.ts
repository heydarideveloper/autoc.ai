import { Injectable } from '@nestjs/common';

import { PlansService } from '../plans/plans.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { normalizeIranPhone } from '../common/utils/phone';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly plansService: PlansService,
    private readonly usersService: UsersService,
  ) {}

  async activate(userId: string, planId: string) {
    await this.plansService.findByIdOrFail(planId);
    const existing = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    const subscription = existing
      ? await this.prisma.subscription.update({
          where: { id: existing.id },
          data: {
            planId,
            isActive: true,
          },
          include: {
            plan: {
              include: {
                planFeatures: {
                  include: { feature: true },
                },
              },
            },
          },
        })
      : await this.prisma.subscription.create({
          data: {
            userId,
            planId,
            isActive: true,
          },
          include: {
            plan: {
              include: {
                planFeatures: {
                  include: { feature: true },
                },
              },
            },
          },
        });

    return this.serializeSubscription(userId, subscription);
  }

  async checkStatusByPhone(phone: string) {
    let normalizedPhone: string;
    try {
      normalizedPhone = normalizeIranPhone(phone);
    } catch {
      normalizedPhone = phone;
    }
    const user = await this.usersService.findByPhone(normalizedPhone);
    if (!user || !user.subscription || !user.subscription.isActive) {
      return {
        isActive: false,
        features: [],
        plan: null,
        userId: user?.id ?? null,
      };
    }

    const features =
      user.subscription.plan.planFeatures?.map((pf) => pf.feature.key) ?? [];

    return {
      isActive: true,
      userId: user.id,
      plan: {
        id: user.subscription.planId,
        name: user.subscription.plan.name,
        price: user.subscription.plan.price,
      },
      features,
    };
  }

  private serializeSubscription(
    userId: string,
    subscription: {
      id: string;
      isActive: boolean;
      plan: {
        id: string;
        name: string;
        price: number;
        planFeatures: { feature: { id: string; key: string; name: string } }[];
      };
    },
  ) {
    return {
      id: subscription.id,
      isActive: subscription.isActive,
      userId,
      plan: this.serializePlan(subscription.plan),
    };
  }

  private serializePlan(plan: {
    id: string;
    name: string;
    price: number;
    planFeatures: { feature: { id: string; key: string; name: string } }[];
  }) {
    return {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      features: plan.planFeatures.map((pf) => ({
        id: pf.feature.id,
        key: pf.feature.key,
        name: pf.feature.name,
      })),
    };
  }
}
