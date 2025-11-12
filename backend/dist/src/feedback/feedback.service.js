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
exports.FeedbackService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const phone_1 = require("../common/utils/phone");
let FeedbackService = class FeedbackService {
    constructor(prisma, usersService) {
        this.prisma = prisma;
        this.usersService = usersService;
    }
    create(user, dto) {
        return this.prisma.feedback.create({
            data: {
                userId: user.sub,
                isPositive: dto.isPositive,
                context: dto.context,
            },
        });
    }
    async createForPhone(phone, dto) {
        const normalizedPhone = (0, phone_1.normalizeIranPhone)(phone);
        const user = await this.usersService.findByPhone(normalizedPhone);
        if (!user) {
            throw new common_1.NotFoundException('User not found for the provided phone number');
        }
        return this.prisma.feedback.create({
            data: {
                userId: user.id,
                isPositive: dto.isPositive,
                context: dto.context,
            },
        });
    }
};
exports.FeedbackService = FeedbackService;
exports.FeedbackService = FeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService])
], FeedbackService);
//# sourceMappingURL=feedback.service.js.map