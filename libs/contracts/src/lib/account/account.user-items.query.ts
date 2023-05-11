import { IUserItems } from "@nx-monorepo-project/interfaces";
import { IsString } from "class-validator";

export namespace AccountUserItems {

    export const topic = 'account.user-items.query';

    export class Request {
        @IsString()
        id: string;
    }

    export class Response {
        items: IUserItems[];
    }

}

