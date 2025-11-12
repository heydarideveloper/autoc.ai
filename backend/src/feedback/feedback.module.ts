import { Module } from '@nestjs/common';

import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { UsersModule } from '../users/users.module';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@Module({
  imports: [UsersModule],
  controllers: [FeedbackController],
  providers: [FeedbackService, ApiKeyGuard],
})
export class FeedbackModule {}
