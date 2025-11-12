import { UsersService } from '../users/users.service';
export declare class AdminController {
    private readonly usersService;
    constructor(usersService: UsersService);
    listUsers(): Promise<{
        id: string;
        phone: string;
        isAdmin: boolean;
        createdAt: Date;
        subscription: {
            id: string;
            isActive: boolean;
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
        };
        feedbacks: {
            id: string;
            isPositive: boolean;
            context: string;
            createdAt: Date;
        }[];
    }[]>;
}
