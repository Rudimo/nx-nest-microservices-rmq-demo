import { Document, Types } from 'mongoose';
import {
  IUser,
  IUserItems,
  PurchaseState,
  UserRole,
} from '@nx-monorepo-project/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserItems extends Document implements IUserItems {
  @Prop({ required: true })
  itemId: string;

  @Prop({ required: true, enum: PurchaseState, type: String })
  purchaseState: PurchaseState;
}

export const UserItemsSchema = SchemaFactory.createForClass(UserItems);

@Schema()
export class User extends Document implements IUser {
  @Prop()
  displayName?: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({
    required: true,
    enum: UserRole,
    type: String,
    default: UserRole.User,
  })
  role: UserRole;

  @Prop({ type: [UserItemsSchema], _id: false })
  items: Types.Array<UserItems>;
}

export const UserSchema = SchemaFactory.createForClass(User);
