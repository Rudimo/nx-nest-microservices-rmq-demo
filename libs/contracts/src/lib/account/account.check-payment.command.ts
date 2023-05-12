import { IsString } from "class-validator";
import { PaymentStatus } from "../payment/payment.check.query";

export namespace AccountCheckPayment {

    export const topic = 'account.buy-subscription.query';

    export class Request {
        @IsString()
        userId: string;

        @IsString()
        subscriptionId: string;
    }

    export class Response {
        status: PaymentStatus
    }

}

