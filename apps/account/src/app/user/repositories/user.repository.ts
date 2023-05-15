import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async createUser(user: UserEntity) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findUserById(id: string) {
    return this.userModel
      .findById(id)
      .select([
        '_id',
        'userName',
        'firstName',
        'lastName',
        'email',
        'role',
        'subscriptions',
      ])
      .exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async updateUser({ _id, ...user }: UserEntity) {
    return this.userModel
      .findByIdAndUpdate(_id, { $set: { ...user } }, { new: true })
      .exec();
  }

  async deleteUser(email: string) {
    return this.userModel.deleteOne({ email }).exec();
  }
}
