import { Injectable } from '@nestjs/common';

import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly gateway: NotificationsGateway) {}

  notifyProductCreated(
    userId: string,
    productId: string,
    productTitle: string,
  ) {
    this.gateway.emitProductCreated(userId, { productId, productTitle });
  }
}
