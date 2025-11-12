import { Controller, Get } from '@nestjs/common';

import { PlansService } from './plans.service';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  async findAll() {
    const plans = await this.plansService.findAll();
    return plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      features: plan.planFeatures.map((pf) => ({
        id: pf.feature.id,
        key: pf.feature.key,
        name: pf.feature.name,
      })),
    }));
  }
}
