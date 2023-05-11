import { Body, Controller } from '@nestjs/common';
import { AccountChangeProfile } from '@nx-monorepo-project/contracts';
import { RMQValidate, RMQRoute } from 'nestjs-rmq';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';

@Controller()
export class UserCommands {

    constructor(private readonly userRepository: UserRepository) {}
  
    @RMQValidate()
    @RMQRoute(AccountChangeProfile.topic)
    async userProfile(
      @Body() { user, id }: AccountChangeProfile.Request
    ): Promise<AccountChangeProfile.Response> {
      const existedUser = await this.userRepository.findUserById(id);
      if (!existedUser) {
        throw new Error('User does not exist')
      }
      const userEntity = new UserEntity(existedUser).updateProfile(user.displayName);
      await this.userRepository.updateUser(userEntity)
      return { };
    }
}
