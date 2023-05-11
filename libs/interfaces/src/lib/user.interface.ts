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
    displayName?: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    items?: IUserItems[];
}

export interface IUserItems {
    _id?: string;
    itemId: string;
    purchaseState: PurchaseState;
}