import { UserEntity } from "../entities/user.entity";
import { BuySubscriptionSaga } from "./buy-subscription.saga";

export abstract class BuySubscriptionState {
    public saga: BuySubscriptionSaga;

    public setContext(saga: BuySubscriptionSaga) {
        this.saga = saga;
    }

    public abstract pay(): Promise<{ paymentLink: string, user: UserEntity }>
    public abstract checkPayment(): Promise<{ user: UserEntity }>
    public abstract cancelPayment(): Promise<{ user: UserEntity }>
}