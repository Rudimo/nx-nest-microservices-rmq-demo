import { IUser } from '@nx-monorepo-project/interfaces';
import { IsObject, IsString } from 'class-validator';

export namespace AccountChangeProfile {
  export const topic = 'account.change-profile.command';

  export class Request {
    @IsString()
    id: string;

    @IsObject()
    user: Pick<IUser, 'userName' | 'firstName' | 'lastName'>;
  }

  export class Response {
    // user: Omit<IUser, 'passwordHash'>;
  }
}
