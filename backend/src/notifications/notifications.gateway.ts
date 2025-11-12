import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

import { AuthenticatedUser } from '../common/types/authenticated-user';

interface ProductCreatedPayload {
  productId: string;
  productTitle: string;
}

@Injectable()
@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private readonly connections = new Map<string, Socket>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ??
        client.handshake.headers.authorization?.replace('Bearer ', '') ??
        client.handshake.query?.token;

      if (!token || typeof token !== 'string') {
        throw new UnauthorizedException('Missing token');
      }

      const payload = (await this.jwtService.verifyAsync(
        token,
      )) as AuthenticatedUser;
      this.connections.set(payload.sub, client);
      client.data.user = payload;
      this.logger.debug(`Client connected: ${payload.sub}`);
    } catch (error) {
      this.logger.warn(`Connection rejected: ${error}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const payload: AuthenticatedUser | undefined = client.data.user;
    if (payload) {
      this.connections.delete(payload.sub);
      this.logger.debug(`Client disconnected: ${payload.sub}`);
    }
  }

  emitProductCreated(userId: string, payload: ProductCreatedPayload) {
    const socket = this.connections.get(userId);
    if (!socket) {
      this.logger.debug(`No active socket for user ${userId}`);
      return;
    }
    socket.emit('product-created', payload);
  }

  // Reserved for potential heartbeat or manual triggers
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() data?: unknown) {
    client.emit('pong', data ?? { ok: true });
  }
}
