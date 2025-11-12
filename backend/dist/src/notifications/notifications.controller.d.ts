import { TriggerNotificationDto } from './dto/trigger-notification.dto';
import { NotificationsService } from './notifications.service';
import { UsersService } from '../users/users.service';
export declare class NotificationsController {
    private readonly notificationsService;
    private readonly usersService;
    constructor(notificationsService: NotificationsService, usersService: UsersService);
    triggerProductCreated(dto: TriggerNotificationDto): Promise<{
        delivered: boolean;
    }>;
}
