import { PlansService } from '../plans/plans.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
export declare class SubscriptionsService {
    private readonly prisma;
    private readonly plansService;
    private readonly usersService;
    constructor(prisma: PrismaService, plansService: PlansService, usersService: UsersService);
    activate(userId: string, planId: string): Promise<{
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
    checkStatusByPhone(phone: string): Promise<{
        isActive: boolean;
        userId: string;
        plan: {
            id: string;
            name: string;
            price: number;
        };
        features: string[];
    }>;
    private serializeSubscription;
    private serializePlan;
}
