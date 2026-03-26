import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  RelationId,
} from 'typeorm';
import { User } from './user.entity';

// import { Vehicle } from 'src/vehicles/vehicle.entity';

export enum TripStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  // Mỗi chuyến đi có 1 tài xế duy nhất
  @ManyToOne(() => User, (user) => user.drivenTrips, { eager: true })
  driver: User;

  // Nhiều khách hàng có thể tham gia
  @ManyToMany(() => User, (user) => user.joinedTrips)
  @JoinTable()
  customers: User[];

  // Danh sách khách hàng đã được tài xế duyệt
  @ManyToMany(() => User, (user) => user.approvedTrips)
  @JoinTable()
  approvedCustomers: User[];

  @RelationId((trip: Trip) => trip.customers)
  customerIds: number[];

  // Xe được sử dụng
  // @ManyToOne(() => Vehicle, (vehicle) => vehicle.trips, { eager: true })
  // vehicle: Vehicle;

  @Column({ type: 'int' })
  slot: number;

  @Column({ type: 'timestamp' })
  departureTime: Date;

  @Column({ type: 'varchar', length: 255 })
  startLocation: string;

  @Column({ type: 'varchar', length: 255 })
  destination: string;

  // Trạng thái chuyến đi
  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.ACTIVE,
  })
  status: TripStatus;

  @Column({ type: 'varchar', length: 10 })
  dayOfWeek: string; // Thứ trong tuần (e.g., 'Monday', 'Tuesday')
}
