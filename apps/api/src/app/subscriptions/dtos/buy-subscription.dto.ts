import { IsString } from 'class-validator';

export class BuySubscriptionDto {
  @IsString()
  subscriptionId: string;
}
