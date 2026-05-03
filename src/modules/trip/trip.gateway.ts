import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class TripGateway {
  @WebSocketServer()
  server!: Server;

  // Lưu trữ userId và socketId
  private userSocketMap = new Map<string, string>();

  // Tài xế hoặc hành khách tham gia room theo tripId
  @SubscribeMessage('joinTripRoom')
  handleJoinTripRoom(
    @MessageBody() data: { tripId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.tripId); // Thêm client vào room với tên là tripId
    this.userSocketMap.set(data.userId, client.id); // Lưu userId và socketId
    console.log(`User ${data.userId} joined room ${data.tripId}`);
  }


  // Xóa user khỏi map khi ngắt kết nối
  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSocketMap.entries()) {
      if (socketId === client.id) {
        this.userSocketMap.delete(userId);
        console.log(`User ${userId} disconnected.`);
        break;
      }
    }
  }
}