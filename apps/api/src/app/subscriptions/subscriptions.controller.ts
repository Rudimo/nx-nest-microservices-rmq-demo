import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JWTAuthGuard } from '../auth/guards/jwt.guard';
import { UserId } from '../auth/decorators/user.decorator';
import { BuySubscriptionDto } from './dtos/buy-subscription.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @UseGuards(JWTAuthGuard)
  @Post('buy')
  async buySubscription(
    @Body() dto: BuySubscriptionDto,
    @UserId() userId: string
  ) {
    return this.subscriptionsService.buy(dto, userId);
  }

  @UseGuards(JWTAuthGuard)
  @Get(':subscriptionId/check-payment')
  async checkPayment(
    @Param('subscriptionId') subscriptionId: string,
    @UserId() userId: string
  ) {
    return this.subscriptionsService.checkPayment(userId, subscriptionId);
  }
}
