import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../user/entities/user.entity';
import { UserRole } from '@nx-monorepo-project/interfaces';
import { JwtService } from '@nestjs/jwt';
import { AccountLogin, AccountRegister } from '@nx-monorepo-project/contracts';
import { PasswordService } from './password.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService
  ) {}

  async register({ email, password, userName }: AccountRegister.Request) {
    const oldUser = await this.userService.findByEmail(email);
    if (oldUser) {
      throw new Error(`User '${email}' already exist`);
    }

    const passwordHash = await this.passwordService.hash(password);

    const newUserEntity = await new UserEntity({
      userName,
      email,
      passwordHash,
      role: UserRole.User,
    });

    const newUser = await this.userService.createUser(newUserEntity);
    return { email: newUser.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error(`Wrong email or password`);
    }

    const isCorrectPassword = await this.passwordService.validate(
      password,
      user.passwordHash
    );

    if (!isCorrectPassword) {
      throw new Error(`Wrong email or password`);
    }

    return {
      id: user._id?.toString(),
      email: user.email,
    };
  }

  async login(id: string, email: string): Promise<AccountLogin.Response> {
    return {
      access_token: await this.jwtService.signAsync({ id, email }),
    };
  }
}
