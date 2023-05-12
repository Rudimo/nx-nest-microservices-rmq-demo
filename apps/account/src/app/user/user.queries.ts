import { Body, Controller } from '@nestjs/common';
import { AccountUserSubscription, AccountUserProfile } from '@nx-monorepo-project/contracts';
import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserQueries {
    constructor(private readonly userRepository: UserRepository) {}
  
    @RMQValidate()
    @RMQRoute(AccountUserProfile.topic)
    async userProfile(
      @Body() { id }: AccountUserProfile.Request
    ): Promise<AccountUserProfile.Response> {
      const user = await this.userRepository.findUserById(id);
      const profile = new UserEntity(user).getPublicProfile();
      return { profile };
    }
  
    @RMQValidate()
    @RMQRoute(AccountUserSubscription.topic)
    async userSubscription(
      @Body() { id }: AccountUserSubscription.Request
    ): Promise<AccountUserSubscription.Response> {
      const user = await this.userRepository.findUserById(id);
        return {
          subscription: user.subscription
        }
    }

}
