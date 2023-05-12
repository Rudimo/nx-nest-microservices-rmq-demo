import { IUserSubscription } from "@nx-monorepo-project/interfaces";
import { IsString } from "class-validator";

export namespace AccountUserSubscriptions {

    export const topic = 'account.user-subscriptions.query';

    export class Request {
        @IsString()
        id: string;
    }

    export class Response {
        subscriptions: IUserSubscription[];
    }

}

