import { IsString } from "class-validator";
import { PurchaseState } from "@nx-monorepo-project/interfaces";

export namespace AccountChangeSubscription {

    export const topic = 'account.change-subscription.event';

    export class Request {
        @IsString()
        userId: string;

        @IsString()
        subscriptionId: string;

        @IsString()
        state: PurchaseState;
    }
}

