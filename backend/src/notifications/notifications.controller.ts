import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { TriggerNotificationDto } from './dto/trigger-notification.dto';
import { NotificationsService } from './notifications.service';
import { UsersService } from '../users/users.service';
import { normalizeIranPhone } from '../common/utils/phone';

@UseGuards(ApiKeyGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('trigger-product-created')
  async triggerProductCreated(@Body() dto: TriggerNotificationDto) {
    let userId = dto.userId;
    if (!userId && dto.phone) {
      const normalizedPhone = normalizeIranPhone(dto.phone);
      const user = await this.usersService.findByPhone(normalizedPhone);
      userId = user?.id;
    }

    if (!userId) {
      throw new BadRequestException('userId or phone must be provided');
    }

    this.notificationsService.notifyProductCreated(
      userId,
      dto.productId,
      dto.productTitle,
    );
    return { delivered: true };
  }
}
