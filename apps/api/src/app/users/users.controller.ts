import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../auth/guards/jwt.guard';
import { UserId } from '../auth/decorators/user.decorator';
import { ChangeProfileDto } from './dtos/change-profile.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JWTAuthGuard)
  @Patch('profile')
  async changeProfile(@Body() dto: ChangeProfileDto, @UserId() userId: string) {
    return this.usersService.changeProfile(dto, userId);
  }

  @UseGuards(JWTAuthGuard)
  @Get('profile')
  async profile(@UserId() userId: string) {
    return this.usersService.getProfile(userId);
  }
}
