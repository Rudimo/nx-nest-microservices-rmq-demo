import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModuleAsyncOptions } from "@nestjs/mongoose";

export const getMongoConfig = (): MongooseModuleAsyncOptions => {
    return {
        useFactory: (configService: ConfigService) => ({
            uri: configService.get('MONGO_URI'),
            // ...getMongoOption
        }),
        inject: [ConfigService],
        imports: [ConfigModule]
    }
}

// const getMongoOption = () => ({
//     useNewUrlParser: true,
//     // useCreateIndex: true,
//     useUnifiedTopology: true,
// })