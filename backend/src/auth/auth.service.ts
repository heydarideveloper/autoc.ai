import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { normalizeIranPhone } from '../common/utils/phone';

@Injectable()
export class AuthService {
  private readonly bcryptRounds: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.bcryptRounds = Number(this.configService.get('BCRYPT_ROUNDS') ?? 10);
  }

  async register(dto: RegisterDto) {
    const normalizedPhone = normalizeIranPhone(dto.phone);
    const existing = await this.usersService.findByPhone(normalizedPhone);
    if (existing) {
      throw new ConflictException('Phone already registered');
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

  async login(dto: LoginDto) {
    const normalizedPhone = normalizeIranPhone(dto.phone);
    const user = await this.usersService.findByPhone(normalizedPhone);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: AuthenticatedUser = {
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
}
