import { IUser } from '@nx-monorepo-project/interfaces';
import { IsString } from 'class-validator';

export namespace AccountChangeProfile {
  export const topic = 'account.change-profile.command';

  export class Request {
    @IsString()
    id: string;

    @IsString()
    user: Pick<IUser, 'userName'>;
  }

  export class Response {
    // user: Omit<IUser, 'passwordHash'>;
  }
}
