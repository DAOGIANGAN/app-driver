import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './message.schema';
import { JwtAccessAuthGuard } from 'src/guards/jwt-auth.guard';
import { MessageGateway } from './message.gateway';

@Controller('message')
export class MessageController {
	constructor(
		private readonly messageService: MessageService,
		private readonly messageGateway: MessageGateway,
	) {}

	// Tạo tin nhắn mới (dùng cho cả trip và private)
	@Post()
	@UseGuards(JwtAccessAuthGuard)
	async createMessage(@Body() data: Partial<Message>) {
		const message = await this.messageService.create(data);
    if (data.tripId) {
      this.messageGateway.sendNewMessageToTrip(String(data.tripId), message);
    }
    return message;
	}

	// Lấy tin nhắn theo tripId
	@UseGuards(JwtAccessAuthGuard)
	@Get('trip')
	async getTripMessages(@Query('tripId') tripId: string) {
		console.log('Received request for tripId:', tripId); // Log để kiểm tra
		return this.messageService.findByTrip(tripId);
	}

	// Lấy tin nhắn riêng giữa 2 user
	@UseGuards(JwtAccessAuthGuard)
	@Get('private')
	async getPrivateMessages(@Query('senderId') senderId: string, @Query('receiverId') receiverId: string) {
		return this.messageService.findPrivate(senderId, receiverId);
	}
}
