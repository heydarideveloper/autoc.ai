export declare class CreateFeedbackDto {
    isPositive: boolean;
    context: string;
}
export declare class BotFeedbackDto extends CreateFeedbackDto {
    phone: string;
}
