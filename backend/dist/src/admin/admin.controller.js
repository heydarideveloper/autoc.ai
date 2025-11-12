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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../common/guards/admin.guard");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const users_service_1 = require("../users/users.service");
let AdminController = class AdminController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async listUsers() {
        const users = await this.usersService.listAllUsers();
        return users.map((user) => ({
            id: user.id,
            phone: user.phone,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            subscription: user.subscription
                ? {
                    id: user.subscription.id,
                    isActive: user.subscription.isActive,
                    plan: {
                        id: user.subscription.plan.id,
                        name: user.subscription.plan.name,
                        price: user.subscription.plan.price,
                        features: user.subscription.plan.planFeatures.map((pf) => ({
                            id: pf.feature.id,
                            key: pf.feature.key,
                            name: pf.feature.name,
                        })),
                    },
                }
                : null,
            feedbacks: user.feedbacks.map((fb) => ({
                id: fb.id,
                isPositive: fb.isPositive,
                context: fb.context,
                createdAt: fb.createdAt,
            })),
        }));
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listUsers", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map