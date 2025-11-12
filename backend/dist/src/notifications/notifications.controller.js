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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const api_key_guard_1 = require("../common/guards/api-key.guard");
const trigger_notification_dto_1 = require("./dto/trigger-notification.dto");
const notifications_service_1 = require("./notifications.service");
const users_service_1 = require("../users/users.service");
const phone_1 = require("../common/utils/phone");
let NotificationsController = class NotificationsController {
    constructor(notificationsService, usersService) {
        this.notificationsService = notificationsService;
        this.usersService = usersService;
    }
    async triggerProductCreated(dto) {
        let userId = dto.userId;
        if (!userId && dto.phone) {
            const normalizedPhone = (0, phone_1.normalizeIranPhone)(dto.phone);
            const user = await this.usersService.findByPhone(normalizedPhone);
            userId = user?.id;
        }
        if (!userId) {
            throw new common_1.BadRequestException('userId or phone must be provided');
        }
        this.notificationsService.notifyProductCreated(userId, dto.productId, dto.productTitle);
        return { delivered: true };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)('trigger-product-created'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [trigger_notification_dto_1.TriggerNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "triggerProductCreated", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService,
        users_service_1.UsersService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map