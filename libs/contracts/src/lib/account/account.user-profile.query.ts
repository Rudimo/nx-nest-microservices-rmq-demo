import { IUser } from "@nx-monorepo-project/interfaces";
import { IsString } from "class-validator";

export namespace AccountUserProfile {

    export const topic = 'account.user-profile.query';

    export class Request {
        @IsString()
        id: string;
    }

    export class Response {
        profile: Omit<IUser, 'passwordHash'>;
    }

}

