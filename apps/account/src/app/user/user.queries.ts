import { Controller } from '@nestjs/common';
import {
  AccountUserSubscriptions,
  AccountUserProfile,
} from '@nx-monorepo-project/contracts';
import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserQueries {
  constructor(private readonly userRepository: UserRepository) {}

  @RMQValidate()
  @RMQRoute(AccountUserProfile.topic)
  async userProfile({
    id,
  }: AccountUserProfile.Request): Promise<AccountUserProfile.Response> {
    const user = await this.userRepository.findUserById(id);
    const profile = new UserEntity(user).getPublicProfile();
    return { profile };
  }

  @RMQValidate()
  @RMQRoute(AccountUserSubscriptions.topic)
  async userSubscriptions({
    id,
  }: AccountUserSubscriptions.Request): Promise<AccountUserSubscriptions.Response> {
    const user = await this.userRepository.findUserById(id);
    return {
      subscriptions: user.subscriptions,
    };
  }
}
