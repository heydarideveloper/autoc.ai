import { IsOptional, IsString } from 'class-validator';

export class TriggerNotificationDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  productId!: string;

  @IsString()
  productTitle!: string;
}
