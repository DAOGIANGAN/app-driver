import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { FCMToken } from './fcm-token.entity';
import { Trip } from './trip.entity';
import { UserBlackList } from './userBlackList.entity';
import { Schedule } from './schedule.entity';
import { FixedTripRequest } from './fixed-trip-request.entity';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  @Index({ fulltext: true })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    default: false,
  })
  isActivated: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens: RefreshToken[];

  @OneToMany(() => FCMToken , (fcmToken) => fcmToken.user)
  fcmTokens: FCMToken[]; // Chưa có entity FCMToken

  // Làm tài xế — 1 user có thể có nhiều chuyến đã từng lái
  @OneToMany(() => Trip, (trip) => trip.driver)
  drivenTrips: Trip[];

  // Làm khách hàng — 1 user có thể tham gia nhiều chuyến
  @ManyToMany(() => Trip, (trip) => trip.customers)
  joinedTrips: Trip[];

  // làm khách hàng được duyệt — 1 user có thể được duyệt trong nhiều chuyến
  @ManyToMany(() => Trip, (trip) => trip.approvedCustomers)
  approvedTrips: Trip[];

  @OneToMany(() => UserBlackList, (blacklist) => blacklist.blocker)
  blockedUsers: UserBlackList[];

  @OneToMany(() => UserBlackList, (blacklist) => blacklist.blocked)
  blockedBy: UserBlackList[];

  @OneToMany(() => Schedule, (schedule) => schedule.user, { cascade: true })
  schedules: Schedule[];

  @OneToMany(
    () => FixedTripRequest,
    (request) => request.requester,
  )
  sentFixedTripRequests: FixedTripRequest[];

  @OneToMany(
    () => FixedTripRequest,
    (request) => request.requestee,
  )
  receivedFixedTripRequests: FixedTripRequest[];

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;
}