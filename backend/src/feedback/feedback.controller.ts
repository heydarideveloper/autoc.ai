import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { BotFeedbackDto, CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateFeedbackDto,
  ) {
    return this.feedbackService.create(user, dto);
  }

  @UseGuards(ApiKeyGuard)
  @Post('bot')
  createFromBot(@Body() dto: BotFeedbackDto) {
    return this.feedbackService.createForPhone(dto.phone, dto);
  }
}
