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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
const phone_1 = require("../common/utils/phone");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.bcryptRounds = Number(this.configService.get('BCRYPT_ROUNDS') ?? 10);
    }
    async register(dto) {
        const normalizedPhone = (0, phone_1.normalizeIranPhone)(dto.phone);
        const existing = await this.usersService.findByPhone(normalizedPhone);
        if (existing) {
            throw new common_1.ConflictException('Phone already registered');
        }
        const passwordHash = await bcrypt.hash(dto.password, this.bcryptRounds);
        const user = await this.usersService.create(normalizedPhone, passwordHash);
        return {
            id: user.id,
            phone: normalizedPhone,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
        };
    }
    async login(dto) {
        const normalizedPhone = (0, phone_1.normalizeIranPhone)(dto.phone);
        const user = await this.usersService.findByPhone(normalizedPhone);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user.id,
            phone: normalizedPhone,
            isAdmin: user.isAdmin,
        };
        const accessToken = await this.jwtService.signAsync(payload);
        return {
            accessToken,
            user: {
                id: user.id,
                phone: user.phone,
                isAdmin: user.isAdmin,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map