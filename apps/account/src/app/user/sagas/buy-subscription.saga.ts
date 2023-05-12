import { RMQService } from "nestjs-rmq";
import { UserEntity } from "../entities/user.entity";
import { PurchaseState } from "@nx-monorepo-project/interfaces";
import { BuySubscriptionState } from "./buy-subscription.state";
import { BuySubscriptionSagaStateStarted } from "./buy-subscription.steps";

export class BuySubscriptionSaga {

    private state: BuySubscriptionState;

    constructor(
        public user: UserEntity,
        public subscriptionId: string,
        public rmqService: RMQService
        ) {
    }

    setState(state: PurchaseState, subscriptionId: string) {
        switch(state) {
            case PurchaseState.Started:
                this.state = new BuySubscriptionSagaStateStarted();
                break;
            case PurchaseState.WaitingForPayment:
                break;
            case PurchaseState.Purchased:
                break;
            case PurchaseState.Canceled:
                break;
        }

        this.state.setContext(this);
        
        this.user.updateSubscriptionStatus(subscriptionId, state);
    }

    getState() {
        return this.state;
    }
}