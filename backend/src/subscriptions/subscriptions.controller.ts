import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import { ActivateSubscriptionDto } from './dto/activate-subscription.dto';
import { SubscriptionsService } from './subscriptions.service';
import { AdminGuard } from '../common/guards/admin.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';

@Controller('subscription')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('activate')
  activate(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ActivateSubscriptionDto,
  ) {
    return this.subscriptionsService.activate(user.sub, dto.planId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/check')
  adminCheck(@Query('phone') phone?: string) {
    if (!phone) {
      throw new BadRequestException('phone is required');
    }
    return this.subscriptionsService.checkStatusByPhone(phone);
  }

  @Get('check')
  check(@Query('phone') phone?: string) {
    if (!phone) {
      throw new BadRequestException('phone is required');
    }
    return this.subscriptionsService.checkStatusByPhone(phone);
  }
}
