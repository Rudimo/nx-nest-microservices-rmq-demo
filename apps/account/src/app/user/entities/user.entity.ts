import { IUser, IUserSubscription, PurchaseState, UserRole } from '@nx-monorepo-project/interfaces';
import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity implements IUser {
  _id?: string;
  userName?: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  subscriptions?: IUserSubscription[];

  constructor(user: IUser) {
    this._id = user._id;
    this.passwordHash = user.passwordHash;
    this.userName = user.userName;
    this.email = user.email;
    this.role = user.role;
    this.subscriptions = user.subscriptions;
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

  public setSubscriptionStatus(subscriptionId: string, state: PurchaseState) {
    const exist = this.subscriptions.find(subscription => subscription._id === subscriptionId)
    if (!exist) {
      this.subscriptions.push({
        subscriptionId,
        purchaseState: state
      })
      return this;
    }
    if (state === PurchaseState.Canceled) {
      this.subscriptions = this.subscriptions.filter(subscription => subscription._id !== subscriptionId);
      return this;
    }
    this.subscriptions = this.subscriptions.map(subscription => {
      if (subscription._id === subscriptionId) {
        subscription.purchaseState = state;
        return subscription;
      }
      return subscription;
    })
  }
}
