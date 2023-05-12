import { IsString } from "class-validator";

export namespace PaymentCheck {

    export const topic = 'payment.check.query';

    export class Request {
        @IsString()
        subscriptionId: string;

        @IsString()
        userId: string;
    }

    export class Response {
        // TODO: to enum
        status: 'canceled' | 'success' | 'progress';
    }

}

