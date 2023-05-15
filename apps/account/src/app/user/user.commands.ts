import { Controller } from '@nestjs/common';
import {
  AccountBuySubscription,
  AccountChangeProfile,
  AccountCheckPayment,
} from '@nx-monorepo-project/contracts';
import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import { UserService } from './user.service';

@Controller()
export class UserCommands {
  constructor(private readonly userService: UserService) {}

  @RMQValidate()
  @RMQRoute(AccountChangeProfile.topic)
  async userProfile({
    user,
    id,
  }: AccountChangeProfile.Request): Promise<AccountChangeProfile.Response> {
    return this.userService.changeProfile(user, id);
  }

  @RMQValidate()
  @RMQRoute(AccountBuySubscription.topic)
  async buySubscription({
    userId,
    subscriptionId,
  }: AccountBuySubscription.Request): Promise<AccountBuySubscription.Response> {
    return this.userService.buySubscription(userId, subscriptionId);
  }

  @RMQValidate()
  @RMQRoute(AccountCheckPayment.topic)
  async checkPayment({
    userId,
    subscriptionId,
  }: AccountCheckPayment.Request): Promise<AccountCheckPayment.Response> {
    return this.userService.checkPayments(userId, subscriptionId);
  }
}
