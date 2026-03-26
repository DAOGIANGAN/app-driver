import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayOfWeek: string; // Thứ trong tuần (e.g., 'Monday', 'Tuesday')

  @Column()
  startTime: string; // Thời gian bắt đầu (HH:mm)

  @Column()
  endTime: string; // Thời gian kết thúc (HH:mm)

  @Column()
  location: string; // Giảng đường

  @Column()
  subjectName: string; // Tên môn học

  @ManyToOne(() => User, (user) => user.schedules, { onDelete: 'CASCADE' })
  user: User;
}