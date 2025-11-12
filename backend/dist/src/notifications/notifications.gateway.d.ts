import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
interface ProductCreatedPayload {
    productId: string;
    productTitle: string;
}
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly jwtService;
    server: Server;
    private readonly logger;
    private readonly connections;
    constructor(jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    emitProductCreated(userId: string, payload: ProductCreatedPayload): void;
    handlePing(client: Socket, data?: unknown): void;
}
export {};
