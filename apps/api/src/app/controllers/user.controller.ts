import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../guards/user.decorator';
import { AccountChangeProfile } from '@nx-monorepo-project/contracts';
import { RMQService } from 'nestjs-rmq';
import { ChangeProfileDto } from '../dtos/change-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly rmqService: RMQService) {}

  @UseGuards(JWTAuthGuard)
  @Patch('profile')
  async profile(@Body() dto: ChangeProfileDto, @UserId() userId: string) {
    try {
      return await this.rmqService.send<
        AccountChangeProfile.Request,
        AccountChangeProfile.Response
      >(AccountChangeProfile.topic, { ...dto, id: userId });
    } catch (e) {
      if (e instanceof Error) {
        throw new HttpException('e.message', HttpStatus.BAD_REQUEST);
      }
    }
  }
}
