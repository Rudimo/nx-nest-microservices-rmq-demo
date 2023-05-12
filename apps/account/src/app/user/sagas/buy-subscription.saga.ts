import { RMQService } from 'nestjs-rmq';
import { UserEntity } from '../entities/user.entity';
import { PurchaseState } from '@nx-monorepo-project/interfaces';
import { BuySubscriptionState } from './buy-subscription.state';
import {
  BuySubscriptionSagaStateCanceled,
  BuySubscriptionSagaStatePurchased,
  BuySubscriptionSagaStateStarted,
  BuySubscriptionSagaStateWaitingForPayment,
} from './buy-subscription.steps';

export class BuySubscriptionSaga {
  private state: BuySubscriptionState;

  constructor(
    public user: UserEntity,
    public subscriptionId: string,
    public rmqService: RMQService
  ) {}

  setState(state: PurchaseState, subscriptionId: string) {
    switch (state) {
      case PurchaseState.Started:
        this.state = new BuySubscriptionSagaStateStarted();
        break;
      case PurchaseState.WaitingForPayment:
        this.state = new BuySubscriptionSagaStateWaitingForPayment();
        break;
      case PurchaseState.Purchased:
        this.state = new BuySubscriptionSagaStatePurchased();
        break;
      case PurchaseState.Canceled:
        this.state = new BuySubscriptionSagaStateCanceled();
        break;
    }

    this.state.setContext(this);

    this.user.setSubscriptionStatus(subscriptionId, state);
  }

  getState() {
    return this.state;
  }
}
