import { Controller } from '@nestjs/common';
import {
  AccountUserSubscriptions,
  AccountUserProfile,
} from '@nx-monorepo-project/contracts';
import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';
import { IUser } from "@nx-monorepo-project/interfaces";

@Controller()
export class UserQueries {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userService: UserService
  ) {}

  @RMQValidate()
  @RMQRoute(AccountUserProfile.topic)
  async getProfile({
    id,
  }: AccountUserProfile.Request): Promise<AccountUserProfile.Response> {
    return this.userService.findById(id);
  }

  @RMQValidate()
  @RMQRoute(AccountUserSubscriptions.topic)
  async userSubscriptions({
    id,
  }: AccountUserSubscriptions.Request): Promise<AccountUserSubscriptions.Response> {
    const user = await this.userRepository.findById(id) as IUser;
    return {
      subscriptions: user.subscriptions,
    };
  }
}
