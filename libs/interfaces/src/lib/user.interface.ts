export enum UserRole {
  Admin = 'Admin',
  User = 'User',
}

export enum PurchaseState {
  Started = 'Started',
  WaitingForPayment = 'WaitingForPayment',
  Purchased = 'Purchased',
  Canceled = 'Canceled',
}

export interface IUser {
  _id?: string;
  email: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  passwordHash: string;
  role: UserRole;
  subscriptions?: IUserSubscription[];
}

export interface IUserSubscription {
  subscriptionId: string;
  purchaseState: PurchaseState;
}
