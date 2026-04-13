import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class RoomTripGateway {
  @WebSocketServer()
  server: Server;

  // Lưu trữ userId và socketId
  private userSocketMap = new Map<string, string>();

  // TẠO SỰ KIỆN MỚI ĐỂ ĐĂNG KÝ USER
  @SubscribeMessage('registerUser')
  handleRegisterUser(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (data.userId) {
      this.userSocketMap.set(data.userId, client.id);
      console.log(`User ${data.userId} registered with socket ${client.id}`);
    }
  }


  // Người dùng tham gia room theo tripId
  @SubscribeMessage('joinTripRoom')
  handleJoinTripRoom(
    @MessageBody() data: { tripId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.tripId); // Thêm client vào room với tên là tripId
    this.userSocketMap.set(data.userId, client.id); // Lưu userId và socketId
    console.log(`User ${data.userId} joined room ${data.tripId}`);
  }

  // Người dùng hủy chuyến
  @SubscribeMessage('cancelTrip')
  handleCancelTrip(
    @MessageBody() data: { tripId: string; userId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`User ${data.userId} canceled trip ${data.tripId}`);

    // Phát thông báo đến tất cả các thành viên trong room
    this.server.to(data.tripId).emit('tripCanceled', {
      message: data.message,
      tripId: data.tripId,
      userId: data.userId,
    });

  }

  // Thông báo cho user đã được duyệt tham gia chuyến
  notifyUserApproved(userId: string) {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('approvedToTrip');
    }
  }

  // Thông báo cho tất cả thành viên trong room rằng user đã được duyệt tham gia chuyến
  public notifyUserApprovedToRoom(customerId: string, tripId: string) {
    console.log(`[Gateway] Thông báo user ${customerId} được duyệt cho phòng ${tripId}`);
    this.server.to(tripId).emit('userApproved', { 
      userId: customerId, 
      tripId: tripId 
    });
  }

  // Thông báo có thêm khách tham gia chuyến, chỉ gửi cho tài xế
  notifyNewCustomerAddedToDriver(driverId: string, tripId: string, customerId: string) {
    const socketId = this.userSocketMap.get(driverId);
    if (socketId) {
      this.server.to(socketId).emit('newCustomerAdded', { tripId, customerId });
    }
  }

}