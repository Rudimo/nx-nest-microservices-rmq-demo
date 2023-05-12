export enum UserRole {
    Admin = 'Admin',
    User = 'User'
}

export enum PurchaseState {
    Started = 'Started',
    WaitingForPayment = 'WaitingForPayment',
    Purchased = 'Purchased',
    Canceled = 'Canceled',
}

export interface IUser {
    _id?: string;
    userName?: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    subscription?: IUserSubscription;
}

export interface IUserSubscription {
    _id?: string;
    subscriptionId: string;
    purchaseState: PurchaseState;
}