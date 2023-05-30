import { ISubscription } from '@nx-monorepo-project/interfaces';
import { IsString } from 'class-validator';

export namespace SubscriptionGetSubscription {
  export const topic = 'subscription.get-subscription.query';

  export class Request {
    @IsString()
    id: string;
  }

  export class Response {
    subscription: ISubscription | null;
  }
}
