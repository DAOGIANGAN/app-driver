import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './message.schema';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  providers: [MessageService, MessageGateway],
  exports: [MessageService, MessageGateway],
  controllers: [MessageController],
})
export class MessageModule {}