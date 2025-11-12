import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByPhone(phone: string): import("../../generated/prisma/models").Prisma__UserClient<{
        subscription: {
            plan: {
                planFeatures: ({
                    feature: {
                        id: string;
                        key: string;
                        name: string;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                } & {
                    planId: string;
                    featureId: string;
                })[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
            };
        } & {
            id: string;
            createdAt: Date;
            planId: string;
            userId: string;
            isActive: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        passwordHash: string;
        isAdmin: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig;
    }>;
    findByIdOrFail(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        passwordHash: string;
        isAdmin: boolean;
    }>;
    create(phone: string, passwordHash: string, isAdmin?: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        passwordHash: string;
        isAdmin: boolean;
    }>;
    listAllUsers(): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        subscription: {
            plan: {
                planFeatures: ({
                    feature: {
                        id: string;
                        key: string;
                        name: string;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                } & {
                    planId: string;
                    featureId: string;
                })[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                price: number;
            };
        } & {
            id: string;
            createdAt: Date;
            planId: string;
            userId: string;
            isActive: boolean;
        };
        feedbacks: {
            id: string;
            createdAt: Date;
            userId: string;
            isPositive: boolean;
            context: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        passwordHash: string;
        isAdmin: boolean;
    })[]>;
}
