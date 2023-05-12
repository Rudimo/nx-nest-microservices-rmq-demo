import {
  PaymentGenerateLink,
  SubcsriptionGetSubscription,
} from '@nx-monorepo-project/contracts';
import { UserEntity } from '../entities/user.entity';
import { BuySubscriptionState } from './buy-subscription.state';
import { PurchaseState } from '@nx-monorepo-project/interfaces';

export class BuySubscriptionSagaStateStarted extends BuySubscriptionState {
    
  public async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    const { subscription } = await this.saga.rmqService.send<
      SubcsriptionGetSubscription.Request,
      SubcsriptionGetSubscription.Response
    >(SubcsriptionGetSubscription.topic, {
      id: this.saga.subscriptionId,
    });

    if (!subscription) {
      throw new Error('Subscription does not exist');
    }

    if (subscription.price === 0) {
        this.saga.setState(PurchaseState.Purchased, subscription._id);
        return { paymentLink: null, user: this.saga.user }
    }

    const { paymentLink } = await this.saga.rmqService.send<
      PaymentGenerateLink.Request,
      PaymentGenerateLink.Response
    >(PaymentGenerateLink.topic, {
      subscriptionId: subscription._id,
      userId: this.saga.user._id,
      sum: subscription.price
    });

    this.saga.setState(PurchaseState.WaitingForPayment, subscription._id);

    return { paymentLink, user: this.saga.user }
  }

  public checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error(`Can't check a non-existent payment.`);
  }

  public async cancelPayment(): Promise<{ user: UserEntity }> {
    this.saga.setState(PurchaseState.Canceled, this.saga.subscriptionId);
    return { user: this.saga.user }
  }
}

// export class BuySubscriptionSagaStateWaitingForPayment extends BuySubscriptionState {
//   public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
//     throw new Error('Method not implemented.');
//   }
//   public checkPayment(): Promise<{ user: UserEntity; }> {
//     throw new Error('Method not implemented.');
//   }
//   public async cancelPayment(): Promise<{ user: UserEntity; }> {
//     this.saga.setState(PurchaseState.Canceled, this.saga.subscriptionId);
//     return { user: this.saga.user }
//   }

// }

// export class BuySubscriptionSagaStatePurchased extends BuySubscriptionState {
//   public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
//     throw new Error('Method not implemented.');
//   }
//   public checkPayment(): Promise<{ user: UserEntity; }> {
//     throw new Error('Method not implemented.');
//   }
//   public async cancelPayment(): Promise<{ user: UserEntity; }> {
//     this.saga.setState(PurchaseState.Canceled, this.saga.subscriptionId);
//     return { user: this.saga.user }
//   }

// }

// export class BuySubscriptionSagaStateCanceled extends BuySubscriptionState {
//   public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
//     throw new Error('Method not implemented.');
//   }
//   public checkPayment(): Promise<{ user: UserEntity; }> {
//     throw new Error('Method not implemented.');
//   }
//   public cancelPayment(): Promise<{ user: UserEntity; }> {
//     throw new Error('Method not implemented.');
//   }
  

// }