import { IsString } from "class-validator";

// TODO: to enum
export type PaymentStatus = 'canceled' | 'success' | 'progress'

export namespace PaymentCheck {

    export const topic = 'payment.check.query';

    export class Request {
        @IsString()
        subscriptionId: string;

        @IsString()
        userId: string;
    }

    export class Response {
        
        status: PaymentStatus;
    }

}

