import { IsBoolean, IsString, MaxLength } from 'class-validator';

export class CreateFeedbackDto {
  @IsBoolean()
  isPositive!: boolean;

  @IsString()
  @MaxLength(100)
  context!: string;
}

export class BotFeedbackDto extends CreateFeedbackDto {
  @IsString()
  @MaxLength(32)
  phone!: string;
}
