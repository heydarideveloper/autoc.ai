import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UsersService } from '../users/users.service';
export declare class FeedbackService {
    private readonly prisma;
    private readonly usersService;
    constructor(prisma: PrismaService, usersService: UsersService);
    create(user: AuthenticatedUser, dto: CreateFeedbackDto): import("../../generated/prisma/models").Prisma__FeedbackClient<{
        id: string;
        createdAt: Date;
        userId: string;
        isPositive: boolean;
        context: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig;
    }>;
    createForPhone(phone: string, dto: CreateFeedbackDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        isPositive: boolean;
        context: string;
    }>;
}
