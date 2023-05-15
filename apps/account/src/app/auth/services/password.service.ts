import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class PasswordService {
  constructor(private configService: ConfigService) {}

  get bcryptSaltRounds(): string | number {
    const saltOrRounds = this.configService.get('BCRYPT_SALT_OR_ROUND');
    return Number.isInteger(Number(saltOrRounds))
      ? Number(saltOrRounds)
      : saltOrRounds;
  }

  public validate(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  public hash(password: string): Promise<string> {
    return hash(password, this.bcryptSaltRounds);
  }
}
