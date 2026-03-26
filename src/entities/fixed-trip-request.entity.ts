import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('fixed_trip_requests')
export class FixedTripRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentFixedTripRequests)
  requester: User;

  @ManyToOne(() => User, (user) => user.receivedFixedTripRequests)
  requestee: User;

  @Column('simple-array')
  requestedDays: string[];

  @Column('simple-array', { nullable: true })
  approvedDays: string[];

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column()
  startLocation: string;

  @Column()
  destination: string;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @CreateDateColumn()
  createdAt: Date;
}
