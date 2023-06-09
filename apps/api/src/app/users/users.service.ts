import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AccountChangeProfile,
  AccountUserProfile,
} from '@nx-monorepo-project/contracts';
import { RMQService } from 'nestjs-rmq';

import { ChangeProfileDto } from './dtos/change-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly rmqService: RMQService) {}

  public async changeProfile(dto: ChangeProfileDto, userId: string) {
    try {
      return await this.rmqService.send<
        AccountChangeProfile.Request,
        AccountChangeProfile.Response
      >(AccountChangeProfile.topic, { user: { ...dto }, id: userId });
    } catch (e) {
      if (e instanceof Error) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  public async getProfile(userId: string) {
    try {
      return (
        await this.rmqService.send<
          AccountUserProfile.Request,
          AccountUserProfile.Response
        >(AccountUserProfile.topic, { id: userId })
      ).profile;
    } catch (e) {
      if (e instanceof Error) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
