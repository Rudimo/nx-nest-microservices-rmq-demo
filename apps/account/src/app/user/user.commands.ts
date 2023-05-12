import { Body, Controller } from '@nestjs/common';
import { AccountBuySubscription, AccountChangeProfile } from '@nx-monorepo-project/contracts';
import { RMQValidate, RMQRoute, RMQService } from 'nestjs-rmq';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserCommands {

    constructor(
      private readonly userRepository: UserRepository,
      private readonly rmqService: RMQService
      ) {}

    @RMQValidate()
    @RMQRoute(AccountChangeProfile.topic)
    async userProfile(
      @Body() { user, id }: AccountChangeProfile.Request
    ): Promise<AccountChangeProfile.Response> {
      const existedUser = await this.userRepository.findUserById(id);
      if (!existedUser) {
        throw new Error('User does not exist')
      }
      const userEntity = new UserEntity(existedUser).updateProfile(user.userName);
      await this.userRepository.updateUser(userEntity)
      return { };
    }

    @RMQValidate()
    @RMQRoute(AccountBuySubscription.topic)
    async buySubscription(
      @Body() { userId, subscriptionId }: AccountBuySubscription.Request
    ): Promise<AccountBuySubscription.Response> {
      const existedUser = await this.userRepository.findUserById(userId);
      if (!existedUser) {
        throw new Error('User does not exist');
      }
      const userEntity = new UserEntity(existedUser);
      const saga = new BuySubscriptionSaga(userEntity, subscriptionId, this.rmqService);
      const { user, paymentLink } = await saga.getState().pay();

      await this.userRepository.updateUser(user);

      return { paymentLink };
    }

    @RMQValidate()
    @RMQRoute(AccountCheckPayment.topic)
    async checkPayment(
      @Body() { userId, subscriptionId }: AccountCheckPayment.Request
    ): Promise<AccountCheckPayment.Response> {
      
    }
}
