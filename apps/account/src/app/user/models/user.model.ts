import { Document, Types } from 'mongoose';
import {
  IUser,
  IUserSubscription,
  PurchaseState,
  UserRole,
} from '@nx-monorepo-project/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserSubscription extends Document implements IUserSubscription {
  @Prop({ required: true })
  subscriptionId: string;

  @Prop({ required: true, enum: PurchaseState, type: String })
  purchaseState: PurchaseState;
}

export const UserSubscriptionSchema =
  SchemaFactory.createForClass(UserSubscription);

@Schema()
export class User extends Document implements IUser {
  @Prop({ required: true })
  email: string;

  @Prop()
  userName?: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({
    required: true,
    enum: UserRole,
    type: String,
    default: UserRole.User,
  })
  role: UserRole;

  @Prop({ type: [UserSubscriptionSchema], _id: false })
  subscriptions: Types.Array<UserSubscription>;
}

export const UserSchema = SchemaFactory.createForClass(User);
