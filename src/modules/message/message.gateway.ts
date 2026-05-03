import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway({ cors: true })
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  // Lưu trữ userId và socketId
  private userSocketMap = new Map<string, string>();

  constructor(private readonly messageService: MessageService) {}

  // HÀM NÀY LÀ QUAN TRỌNG NHẤT CẦN SỬA
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { tripId: string }, // Nhận tripId là string
    @ConnectedSocket() client: Socket,
  ) {
    // Kiểm tra xem có nhận được tripId không
    if (data && data.tripId) {
      // Cho client tham gia vào phòng có tên là chuỗi
      client.join(data.tripId);
      console.log(`[Gateway] Client ${client.id} đã tham gia phòng: "${data.tripId}"`);
    } else {
      console.log(`[Gateway] Client ${client.id} gửi sự kiện joinRoom nhưng không có tripId.`);
    }
  }

  // Hàm này không còn được dùng trong luồng chính nữa, nhưng cứ để đó
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { senderId: string; content: string; tripId?: string; receiverId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    // ...
  }

  // Hàm này được gọi từ Controller
  public sendNewMessageToTrip(tripId: string, message: any) {
    console.log(`[Gateway] Phát sự kiện 'newMessage' tới phòng: "${tripId}"`);
    this.server.to(tripId).emit('newMessage', message);
  }
}