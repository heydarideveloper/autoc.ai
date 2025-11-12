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
var NotificationsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
let NotificationsGateway = NotificationsGateway_1 = class NotificationsGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(NotificationsGateway_1.name);
        this.connections = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token ??
                client.handshake.headers.authorization?.replace('Bearer ', '') ??
                client.handshake.query?.token;
            if (!token || typeof token !== 'string') {
                throw new common_1.UnauthorizedException('Missing token');
            }
            const payload = (await this.jwtService.verifyAsync(token));
            this.connections.set(payload.sub, client);
            client.data.user = payload;
            this.logger.debug(`Client connected: ${payload.sub}`);
        }
        catch (error) {
            this.logger.warn(`Connection rejected: ${error}`);
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        const payload = client.data.user;
        if (payload) {
            this.connections.delete(payload.sub);
            this.logger.debug(`Client disconnected: ${payload.sub}`);
        }
    }
    emitProductCreated(userId, payload) {
        const socket = this.connections.get(userId);
        if (!socket) {
            this.logger.debug(`No active socket for user ${userId}`);
            return;
        }
        socket.emit('product-created', payload);
    }
    handlePing(client, data) {
        client.emit('pong', data ?? { ok: true });
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handlePing", null);
exports.NotificationsGateway = NotificationsGateway = NotificationsGateway_1 = __decorate([
    (0, common_1.Injectable)(),
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map