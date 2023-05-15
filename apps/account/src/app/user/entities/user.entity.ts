import { AccountChangeSubscription } from '@nx-monorepo-project/contracts';
import {
  IDomainEvent,
  IUser,
  IUserSubscription,
  PurchaseState,
  UserRole,
} from '@nx-monorepo-project/interfaces';

export class UserEntity implements IUser {
  _id?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  subscriptions?: IUserSubscription[];
  events: IDomainEvent[] = [];

  constructor(user: IUser) {
    this._id = user._id;
    this.passwordHash = user.passwordHash;
    this.userName = user.userName;
    this.firstName = user.userName;
    this.lastName = user.userName;
    this.email = user.email;
    this.role = user.role;
    this.subscriptions = user.subscriptions;
  }

  public getPublicProfile() {
    return {
      _id: this._id,
      userName: this.userName,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
    };
  }

  public updateProfile(
    user: Pick<IUser, 'userName' | 'firstName' | 'lastName'>
  ) {
    this.userName = user.userName;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    return this;
  }

  public setSubscriptionStatus(subscriptionId: string, state: PurchaseState) {
    const exist = this.subscriptions.find(
      (subscription) => subscription._id === subscriptionId
    );
    if (!exist) {
      this.subscriptions.push({
        subscriptionId,
        purchaseState: state,
      });
      return this;
    }

    if (state === PurchaseState.Canceled) {
      this.subscriptions = this.subscriptions.filter(
        (subscription) => subscription._id !== subscriptionId
      );
      return this;
    }

    this.subscriptions = this.subscriptions.map((subscription) => {
      if (subscription._id === subscriptionId) {
        subscription.purchaseState = state;
        return subscription;
      }
      return subscription;
    });

    this.events.push({
      topic: AccountChangeSubscription.topic,
      data: { subscriptionId, userId: this._id, state },
    });

    return this;
  }
}
