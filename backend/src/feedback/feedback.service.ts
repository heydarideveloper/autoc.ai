import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UsersService } from '../users/users.service';
import { normalizeIranPhone } from '../common/utils/phone';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  create(user: AuthenticatedUser, dto: CreateFeedbackDto) {
    return this.prisma.feedback.create({
      data: {
        userId: user.sub,
        isPositive: dto.isPositive,
        context: dto.context,
      },
    });
  }

  async createForPhone(phone: string, dto: CreateFeedbackDto) {
    const normalizedPhone = normalizeIranPhone(phone);
    const user = await this.usersService.findByPhone(normalizedPhone);
    if (!user) {
      throw new NotFoundException(
        'User not found for the provided phone number',
      );
    }
    return this.prisma.feedback.create({
      data: {
        userId: user.id,
        isPositive: dto.isPositive,
        context: dto.context,
      },
    });
  }
}
