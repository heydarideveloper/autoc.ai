import { ActivateSubscriptionDto } from './dto/activate-subscription.dto';
import { SubscriptionsService } from './subscriptions.service';
import { AuthenticatedUser } from '../common/types/authenticated-user';
export declare class SubscriptionsController {
    private readonly subscriptionsService;
    constructor(subscriptionsService: SubscriptionsService);
    activate(user: AuthenticatedUser, dto: ActivateSubscriptionDto): Promise<{
        id: string;
        isActive: boolean;
        userId: string;
        plan: {
            id: string;
            name: string;
            price: number;
            features: {
                id: string;
                key: string;
                name: string;
            }[];
        };
    }>;
    adminCheck(phone?: string): Promise<{
        isActive: boolean;
        userId: string;
        plan: {
            id: string;
            name: string;
            price: number;
        };
        features: string[];
    }>;
    check(phone?: string): Promise<{
        isActive: boolean;
        userId: string;
        plan: {
            id: string;
            name: string;
            price: number;
        };
        features: string[];
    }>;
}
