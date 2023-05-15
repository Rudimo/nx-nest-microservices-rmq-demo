import { IUser } from '@nx-monorepo-project/interfaces';

export type ChangeProfileDto = Pick<
  IUser,
  'userName' | 'firstName' | 'lastName'
>;
