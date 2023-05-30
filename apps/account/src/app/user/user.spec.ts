import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from '../configs/mongo.config';
import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';
import { UserModule } from './user.module';
import { INestApplication } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import {
  AccountBuySubscription,
  AccountCheckPayment,
  AccountLogin,
  AccountRegister,
  AccountUserProfile,
  PaymentCheck,
  PaymentGenerateLink,
  SubscriptionGetSubscription,
} from '@nx-monorepo-project/contracts';
import { AuthModule } from '../auth/auth.module';
import { verify } from 'jsonwebtoken';

const authLogin: AccountLogin.Request = {
  email: 'q2@q.com',
  password: '1',
};

const authRegister: AccountRegister.Request = {
  ...authLogin,
  userName: 'John',
};

const subscriptionId = 'subscriptionId';

describe('User', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let rmqService: RMQTestService;
  let configService: ConfigService;
  let access_token: string;
  let userId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'envs/.account.env',
        }),
        MongooseModule.forRootAsync(getMongoConfig()),
        RMQModule.forTest({}),
        UserModule,
        AuthModule,
      ],
    }).compile();
    app = module.createNestApplication();
    userRepository = app.get<UserRepository>(UserRepository);
    rmqService = app.get(RMQService);
    configService = app.get<ConfigService>(ConfigService);

    await app.init();

    await rmqService.triggerRoute<
      AccountRegister.Request,
      AccountRegister.Response
    >(AccountRegister.topic, authRegister);

    const loginData = await rmqService.triggerRoute<
      AccountLogin.Request,
      AccountLogin.Response
    >(AccountLogin.topic, authLogin);

    access_token = loginData.access_token;
    const data = verify(access_token, configService.get('JWT_SECRET'));
    userId = data['id'];
  }, 10000);

  it('AccountUserProfile', async () => {
    const res = await rmqService.triggerRoute<
      AccountUserProfile.Request,
      AccountUserProfile.Response
    >(AccountUserProfile.topic, { id: userId });

    expect(res.profile.userName).toEqual(authRegister.userName);
  });

  it('BuySubscription', async () => {
    const paymentLink = 'https://paymentLink';

    rmqService.mockReply<SubscriptionGetSubscription.Response>(
      SubscriptionGetSubscription.topic,
      {
        subscription: {
          _id: subscriptionId,
          price: 100,
        },
      }
    );

    rmqService.mockReply<PaymentGenerateLink.Response>(
      PaymentGenerateLink.topic,
      {
        paymentLink,
      }
    );

    const res = await rmqService.triggerRoute<
      AccountBuySubscription.Request,
      AccountBuySubscription.Response
    >(AccountBuySubscription.topic, { userId, subscriptionId });

    expect(res.paymentLink).toEqual(paymentLink);

    await expect(
      rmqService.triggerRoute<
        AccountBuySubscription.Request,
        AccountBuySubscription.Response
      >(AccountBuySubscription.topic, { userId, subscriptionId })
    ).rejects.toThrowError();
  });

  it('CheckPayment', async () => {
    rmqService.mockReply<PaymentCheck.Response>(PaymentCheck.topic, {
      status: 'success',
    });

    const res = await rmqService.triggerRoute<
      AccountCheckPayment.Request,
      AccountCheckPayment.Response
    >(AccountCheckPayment.topic, { userId, subscriptionId });

    expect(res.status).toEqual('success');
  });

  afterAll(async () => {
    await userRepository.deleteUser(authRegister.email);
    app.close();
  });
});
