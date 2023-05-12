import { IUserSubscription } from "@nx-monorepo-project/interfaces";
import { IsString } from "class-validator";

export namespace AccountUserSubscription {

    export const topic = 'account.user-subscription.query';

    export class Request {
        @IsString()
        id: string;
    }

    export class Response {
        subscription: IUserSubscription;
    }

}

