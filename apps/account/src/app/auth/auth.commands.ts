import { Controller } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AccountLogin, AccountRegister } from '@nx-monorepo-project/contracts';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';

@Controller('auth')
export class AuthCommands {
  constructor(private readonly authService: AuthService) {}

  @RMQValidate()
  @RMQRoute(AccountRegister.topic)
  async register(
    dto: AccountRegister.Request
  ): Promise<AccountRegister.Response> {
    return this.authService.register(dto);
  }

  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login({
    email,
    password,
  }: AccountLogin.Request): Promise<AccountLogin.Response> {
    const validatedUser = await this.authService.validateUser(email, password);
    return this.authService.login(validatedUser.id, validatedUser.email);
  }
}
