import { IUser } from '@nx-monorepo-project/interfaces';
import { IsOptional, IsString } from 'class-validator';

export class ChangeProfileDto {
  user: Pick<IUser, 'displayName'>;
}
