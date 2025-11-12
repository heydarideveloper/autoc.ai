import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const configuredKey = this.configService.get<string>('BOT_API_KEY');

    if (!configuredKey) {
      throw new UnauthorizedException('API key not configured');
    }

    const headerKey =
      request.headers['x-api-key'] ??
      request.headers['x-api_key'] ??
      request.headers['x-apikey'];

    if (!headerKey || String(headerKey) !== configuredKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
