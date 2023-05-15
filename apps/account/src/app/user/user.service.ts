import { Injectable } from '@nestjs/common';
import {
  AccountChangeProfile
} from '@nx-monorepo-project/contracts';
import { IUser } from '@nx-monorepo-project/interfaces';
import { RMQService } from 'nestjs-rmq';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { BuySubscriptionSaga } from './sagas/buy-subscription.saga';
import { UserEventEmitter } from './user.event-emmiter';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService,
    private readonly userEventEmitter: UserEventEmitter
  ) {}

  public async findById(id: string) {
    const user = await this.userRepository.findById(id);
    const profile = new UserEntity(user).getPublicProfile();
    return { profile };
  }

  public async findByEmail(email: string) {
    return await this.userRepository.findByEmail(email);
  }

  public async createUser(userEntity) {
    return await this.userRepository.createUser(userEntity);
  }

  public async changeProfile(
    user: Pick<IUser, 'userName' | 'firstName' | 'lastName'>,
    id: string
  ): Promise<AccountChangeProfile.Response> {
    const existedUser = await this.userRepository.findById(id);
    if (!existedUser) {
      throw new Error('User does not exist');
    }
    const userEntity = new UserEntity(existedUser).updateProfile(user);
    await this.updateUser(userEntity);
    return { updated: true };
  }

  public async buySubscription(userId: string, subscriptionId: string) {
    const existedUser = await this.userRepository.findById(userId);
    if (!existedUser) {
      throw new Error('User does not exist');
    }
    const userEntity = new UserEntity(existedUser);
    const saga = new BuySubscriptionSaga(
      userEntity,
      subscriptionId,
      this.rmqService
    );
    const { user, paymentLink } = await saga.getState().pay();

    await this.updateUser(user);

    return { paymentLink };
  }

  public async checkPayments(userId: string, subscriptionId: string) {
    const existedUser = await this.userRepository.findById(userId);
    if (!existedUser) {
      throw new Error('User does not exist');
    }
    const userEntity = new UserEntity(existedUser);
    const saga = new BuySubscriptionSaga(
      userEntity,
      subscriptionId,
      this.rmqService
    );
    const { user, status } = await saga.getState().checkPayment();

    await this.updateUser(user);

    return { status };
  }

  private async updateUser(user: UserEntity) {
    return Promise.all([
      this.userRepository.updateUser(user),
      this.userEventEmitter.handle(user),
    ]);
  }
}
