import { NotificationsGateway } from './notifications.gateway';
export declare class NotificationsService {
    private readonly gateway;
    constructor(gateway: NotificationsGateway);
    notifyProductCreated(userId: string, productId: string, productTitle: string): void;
}
