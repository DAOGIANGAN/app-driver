// filepath: e:\AppDriver\app-driver\src\modules\fixed-trip-request\fixed-trip-request.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FixedTripRequest, RequestStatus } from 'src/entities/fixed-trip-request.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class FixedTripRequestService {
  constructor(
    @InjectRepository(FixedTripRequest)
    private readonly requestRepository: Repository<FixedTripRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createRequest(
    requesterId: number,
    requesteeId: number,
    data: {
      requestedDay: string;
      startTime: string;
      endTime: string;
      startLocation: string;
      destination: string;
    },
  ) {
    const requester = await this.userRepository.findOneBy({ id: requesterId });
    const requestee = await this.userRepository.findOneBy({ id: requesteeId });

    if (!requester || !requestee) {
      throw new NotFoundException('User not found');
    }
    if (requesterId === requesteeId) {
      throw new BadRequestException('Cannot send request to yourself.');
    }

    const newRequest = this.requestRepository.create({
      requester,
      requestee,
      requestedDay: data.requestedDay,
      startTime: data.startTime,
      endTime: data.endTime,
      startLocation: data.startLocation,
      destination: data.destination,
      status: RequestStatus.PENDING,
    });

    return this.requestRepository.save(newRequest);
  }

  async getReceivedRequests(userId: number) {
    return this.requestRepository.find({
      where: { requestee: { id: userId }, status: RequestStatus.PENDING },
      relations: ['requester', 'requester.profile'],
    });
  }

  async approveRequest(requestId: number, approverId: number) {
    const request = await this.requestRepository.findOne({
        where: { id: requestId },
        relations: ['requestee']
    });

    if (!request) throw new NotFoundException('Request not found.');
    if (request.requestee.id !== approverId) throw new BadRequestException('You are not authorized to approve this request.');
    if (request.status !== RequestStatus.PENDING) throw new BadRequestException('Request is not pending.');

    request.status = RequestStatus.APPROVED;
    return this.requestRepository.save(request);
  }

  async rejectRequest(requestId: number, approverId: number) {
    const request = await this.requestRepository.findOne({
        where: { id: requestId },
        relations: ['requestee']
    });

    if (!request) throw new NotFoundException('Request not found.');
    if (request.requestee.id !== approverId) throw new BadRequestException('You are not authorized to reject this request.');
    
    request.status = RequestStatus.REJECTED;
    return this.requestRepository.save(request);
  }
  
}