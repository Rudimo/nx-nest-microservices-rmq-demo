import {
  PaymentCheck,
  PaymentGenerateLink,
  PaymentStatus,
  SubscriptionGetSubscription,
} from '@nx-monorepo-project/contracts';
import { UserEntity } from '../entities/user.entity';
import { BuySubscriptionState } from './buy-subscription.state';
import { PurchaseState } from '@nx-monorepo-project/interfaces';

export class BuySubscriptionSagaStateStarted extends BuySubscriptionState {
  public async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    const { subscription } = await this.saga.rmqService.send<
      SubscriptionGetSubscription.Request,
      SubscriptionGetSubscription.Response
    >(SubscriptionGetSubscription.topic, {
      id: this.saga.subscriptionId,
    });

    if (!subscription) {
      throw new Error('Subscription does not exist');
    }

    if (subscription.price === 0) {
      this.saga.setState(PurchaseState.Purchased, subscription._id);
      return { paymentLink: null, user: this.saga.user };
    }

    const { paymentLink } = await this.saga.rmqService.send<
      PaymentGenerateLink.Request,
      PaymentGenerateLink.Response
    >(PaymentGenerateLink.topic, {
      subscriptionId: subscription._id,
      userId: this.saga.user._id,
      sum: subscription.price,
    });

    this.saga.setState(PurchaseState.WaitingForPayment, subscription._id);

    return { paymentLink, user: this.saga.user };
  }

  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error(`Can't check a non-existent payment.`);
  }

  public async cancelPayment(): Promise<{ user: UserEntity }> {
    this.saga.setState(PurchaseState.Canceled, this.saga.subscriptionId);
    return { user: this.saga.user };
  }
}

export class BuySubscriptionSagaStateWaitingForPayment extends BuySubscriptionState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('You are already in the process of paying.');
  }
  public async checkPayment(): Promise<{
    user: UserEntity;
    status: PaymentStatus;
  }> {
    const { status } = await this.saga.rmqService.send<
      PaymentCheck.Request,
      PaymentCheck.Response
    >(PaymentCheck.topic, {
      subscriptionId: this.saga.subscriptionId,
      userId: this.saga.user._id,
    });
    if (status === 'canceled') {
      this.saga.setState(PurchaseState.Canceled, this.saga.subscriptionId);
      return { user: this.saga.user, status: 'canceled' };
    }
    if (status !== 'success') {
      this.saga.setState(PurchaseState.Canceled, this.saga.subscriptionId);
      return { user: this.saga.user, status: 'success' };
    }
    this.saga.setState(PurchaseState.Purchased, this.saga.subscriptionId);
    return { user: this.saga.user, status: 'progress' };
  }
  public async cancelPayment(): Promise<{ user: UserEntity }> {
    throw new Error(`You can't cancel a payment that's in progress.`);
  }
}

export class BuySubscriptionSagaStatePurchased extends BuySubscriptionState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error(
      'You cannot pay for a subscription that has already been paid.'
    );
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error(
      'You cannot check the payment of a subscription that has already been purchased.'
    );
  }
  public async cancelPayment(): Promise<{ user: UserEntity }> {
    throw new Error('You cannot cancel a purchased subscription.');
  }
}

export class BuySubscriptionSagaStateCanceled extends BuySubscriptionState {
  public pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    this.saga.setState(PurchaseState.Started, this.saga.subscriptionId);
    return this.saga.getState().pay();
  }
  public checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new Error(`You can't check a payment at a canceled subscription.`);
  }
  public async cancelPayment(): Promise<{ user: UserEntity }> {
    throw new Error('You cannot cancel a canceled subscription.');
  }
}
