import { IsString } from "class-validator";

export namespace AccountBuySubscription {

    export const topic = 'account.buy-subscription.query';

    export class Request {
        @IsString()
        userId: string;

        @IsString()
        subscriptionId: string;
    }

    export class Response {
        paymentLink: string
    }

}

