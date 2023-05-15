import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { getJWTConfig } from '../configs/jwt.config';

@Module({
  imports: [PassportModule, JwtModule.registerAsync(getJWTConfig())],
  controllers: [AuthController],
  providers: [JwtStrategy],
})
export class AuthModule {}
