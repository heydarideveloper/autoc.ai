import { PrismaService } from '../prisma/prisma.service';
export declare class PlansService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<({
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
    })[]>;
    findByIdOrFail(planId: string): Promise<{
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
    }>;
}
