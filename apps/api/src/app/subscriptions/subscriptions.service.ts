import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { AccountBuySubscription } from '@nx-monorepo-project/contracts';
import { BuySubscriptionDto } from './dtos/buy-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly rmqService: RMQService) {}

  public async buy(dto: BuySubscriptionDto, userId: string) {
    try {
      return await this.rmqService.send<
        AccountBuySubscription.Request,
        AccountBuySubscription.Response
      >(AccountBuySubscription.topic, { userId, ...dto });
    } catch (e) {
      if (e instanceof Error) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  public async checkPayment(userId: string, subscriptionId: string) {
    try {
      return await this.rmqService.send<
        AccountBuySubscription.Request,
        AccountBuySubscription.Response
      >(AccountBuySubscription.topic, { userId, subscriptionId });
    } catch (e) {
      if (e instanceof Error) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
