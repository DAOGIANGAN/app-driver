import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Thêm dòng này
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './modules/auth/auth.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UserService } from './modules/user/user.service';
import { UserModule } from './modules/user/user.module';
import { TripModule } from './modules/trip/trip.module';
import { BlackListModule } from './modules/black-list/black-list.module';
import { MessageController } from './modules/message/message.controller';
import { MessageModule } from './modules/message/message.module';
import { Schedule } from './entities/schedule.entity';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { F } from 'node_modules/@faker-js/faker/dist/airline-DF6RqYmq';
import { FixedTripRequestModule } from './modules/fixed-trip-request/fixed-trip-request.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/appdriver'),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // hoặc host của bạn
      port: 5432,
      username: 'postgres', // thay bằng user của bạn
      password: '0977980400', // thay bằng password của bạn
      database: 'appdriver', // thay bằng tên database của bạn
      autoLoadEntities: true,
            ssl:
        process.env.DATABASE_SSL === 'true'
          ? {
              rejectUnauthorized: false,
            }
          : false,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // KHÔNG dùng ở môi trường production
    }),
    MailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        // ignoreTLS: true,
        // secure: true,
        auth: {
          user: 'daogiangan0504@gmail.com',
          pass: 'qwevcanfqbplmvgg',
        },
      },
      defaults: {
        from: '"No Reply" <no-reply@localhost>',
      },
      // preview: true,
      template: {
        dir: join(__dirname, '../src/mail/templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
   
    }),
    AuthModule,
    UserModule,
    TripModule,
    BlackListModule,
    MessageModule,
    ScheduleModule,
    FixedTripRequestModule,
    ProfileModule,
  ],
  controllers: [AppController, MessageController],
  providers: [AppService],
})
export class AppModule {}
