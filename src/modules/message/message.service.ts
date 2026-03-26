import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  // Tạo tin nhắn mới
  async create(data: Partial<Message>) {
    console.log('Creating message with data:', data); // Log để kiểm tra
    const created = new this.messageModel(data);
    return created.save();
  }

  // Lấy tin nhắn theo trip
  async findByTrip(tripId: string) {
    return this.messageModel
      .find({ tripId, type: 'trip' })
      .select('_id senderId content createdAt')
      .sort({ createdAt: 1 })
      .exec();
  }

  // Lấy tin nhắn riêng giữa 2 user
  async findPrivate(senderId: string, receiverId: string) {
    return this.messageModel.find({
      type: 'private',
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 }).exec();
  }
}