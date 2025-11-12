"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const plans_service_1 = require("../plans/plans.service");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const phone_1 = require("../common/utils/phone");
let SubscriptionsService = class SubscriptionsService {
    constructor(prisma, plansService, usersService) {
        this.prisma = prisma;
        this.plansService = plansService;
        this.usersService = usersService;
    }
    async activate(userId, planId) {
        await this.plansService.findByIdOrFail(planId);
        const existing = await this.prisma.subscription.findUnique({
            where: { userId },
        });
        const subscription = existing
            ? await this.prisma.subscription.update({
                where: { id: existing.id },
                data: {
                    planId,
                    isActive: true,
                },
                include: {
                    plan: {
                        include: {
                            planFeatures: {
                                include: { feature: true },
                            },
                        },
                    },
                },
            })
            : await this.prisma.subscription.create({
                data: {
                    userId,
                    planId,
                    isActive: true,
                },
                include: {
                    plan: {
                        include: {
                            planFeatures: {
                                include: { feature: true },
                            },
                        },
                    },
                },
            });
        return this.serializeSubscription(userId, subscription);
    }
    async checkStatusByPhone(phone) {
        let normalizedPhone;
        try {
            normalizedPhone = (0, phone_1.normalizeIranPhone)(phone);
        }
        catch {
            normalizedPhone = phone;
        }
        const user = await this.usersService.findByPhone(normalizedPhone);
        if (!user || !user.subscription || !user.subscription.isActive) {
            return {
                isActive: false,
                features: [],
                plan: null,
                userId: user?.id ?? null,
            };
        }
        const features = user.subscription.plan.planFeatures?.map((pf) => pf.feature.key) ?? [];
        return {
            isActive: true,
            userId: user.id,
            plan: {
                id: user.subscription.planId,
                name: user.subscription.plan.name,
                price: user.subscription.plan.price,
            },
            features,
        };
    }
    serializeSubscription(userId, subscription) {
        return {
            id: subscription.id,
            isActive: subscription.isActive,
            userId,
            plan: this.serializePlan(subscription.plan),
        };
    }
    serializePlan(plan) {
        return {
            id: plan.id,
            name: plan.name,
            price: plan.price,
            features: plan.planFeatures.map((pf) => ({
                id: pf.feature.id,
                key: pf.feature.key,
                name: pf.feature.name,
            })),
        };
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        plans_service_1.PlansService,
        users_service_1.UsersService])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map