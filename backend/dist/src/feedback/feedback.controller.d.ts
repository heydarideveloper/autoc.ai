import { AuthenticatedUser } from '../common/types/authenticated-user';
import { BotFeedbackDto, CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';
export declare class FeedbackController {
    private readonly feedbackService;
    constructor(feedbackService: FeedbackService);
    create(user: AuthenticatedUser, dto: CreateFeedbackDto): import("../../generated/prisma/models").Prisma__FeedbackClient<{
        id: string;
        createdAt: Date;
        userId: string;
        isPositive: boolean;
        context: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig;
    }>;
    createFromBot(dto: BotFeedbackDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        isPositive: boolean;
        context: string;
    }>;
}
