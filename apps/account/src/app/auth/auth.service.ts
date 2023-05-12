import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { UserEntity } from '../user/entities/user.entity';
import { UserRole } from '@nx-monorepo-project/interfaces';
import { JwtService } from '@nestjs/jwt';
import { AccountRegister } from '@nx-monorepo-project/contracts';

@Injectable()
export class AuthService {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService
    ) {}

    async register({ email, password, userName }: AccountRegister.Request) {
        const oldUser = await this.userRepository.findUser(email);
        if (oldUser) {
            throw new Error(`User '${email}' already exist`)
        }
        const newUserEntity = await new UserEntity({
            userName,
            email,
            passwordHash: '',
            role: UserRole.User
        }).setPassword(password);

        const newUser = await this.userRepository.createUser(newUserEntity);
        return { email: newUser.email }
    }

    async validateUser(email: string, password: string) {
        const user = await this.userRepository.findUser(email);
        if (!user) {
            throw new Error(`Wrong email or password`)
        }

        const userEntity = new UserEntity(user);
        const isCorrectPassword = await userEntity.validatePassword(password);

        if (!isCorrectPassword) {
            throw new Error(`Wrong email or password`)
        }

        return {
            id: user._id
        }
    }

    async login(id: string) {
        return {
            access_token: await this.jwtService.signAsync({id})
        }
    }
}
