import { Controller, Get, UseGuards } from '@nestjs/common';

import { AdminGuard } from '../common/guards/admin.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  async listUsers() {
    const users = await this.usersService.listAllUsers();
    return users.map((user) => ({
      id: user.id,
      phone: user.phone,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      subscription: user.subscription
        ? {
            id: user.subscription.id,
            isActive: user.subscription.isActive,
            plan: {
              id: user.subscription.plan.id,
              name: user.subscription.plan.name,
              price: user.subscription.plan.price,
              features: user.subscription.plan.planFeatures.map((pf) => ({
                id: pf.feature.id,
                key: pf.feature.key,
                name: pf.feature.name,
              })),
            },
          }
        : null,
      feedbacks: user.feedbacks.map((fb) => ({
        id: fb.id,
        isPositive: fb.isPositive,
        context: fb.context,
        createdAt: fb.createdAt,
      })),
    }));
  }
}
