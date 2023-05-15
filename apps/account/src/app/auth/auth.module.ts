import { Module } from '@nestjs/common';
import { AuthCommands } from './auth.commands';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../configs/jwt.config';
import { PasswordService } from './services/password.service';

@Module({
  imports: [UserModule, JwtModule.registerAsync(getJWTConfig())],
  controllers: [AuthCommands],
  providers: [AuthService, PasswordService],
})
export class AuthModule {}
