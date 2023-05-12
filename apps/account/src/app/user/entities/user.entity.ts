import { IUser, IUserSubscription, PurchaseState, UserRole } from '@nx-monorepo-project/interfaces';
import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity implements IUser {
  _id?: string;
  userName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  subscription?: IUserSubscription;

  constructor(user: IUser) {
    this._id = user._id;
    this.passwordHash = user.passwordHash;
    this.userName = user.userName;
    this.email = user.email;
    this.role = user.role;
    this.subscription = user.subscription;
  }

  public getPublicProfile() {
    return {
      _id: this._id,
      userName: this.userName,
      email: this.email,
      role: this.role,
    }
  }

  public async setPassword(password: string) {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public validatePassword(password: string) {
    return compare(password, this.passwordHash);
  }

  
  public updateProfile(userName: string) {
    this.userName = userName;
    return this;
  }

  public addSubscription(subscriptionId: string) {
    if (this.subscription) {
      throw new Error('You have an active subscription');
    }

    this.subscription = {
      subscriptionId,
      purchaseState: PurchaseState.Started
    };
  }

  public deleteSubscription(subscriptionId: string) {
    if (this.subscription._id === subscriptionId) {
      this.subscription = null;
    }
  }

  public updateSubscriptionStatus(subscriptionId: string, state: PurchaseState) {
    if (this.subscription._id === subscriptionId) {
      this.subscription.purchaseState = state;
    }
  }
}
