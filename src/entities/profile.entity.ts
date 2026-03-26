import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Tên hiển thị

  @Column()
  email: string;

  @Column({ nullable: true })
  urlPublicAvatar: string; // Đường dẫn ảnh public

  @Column({ nullable: true })
  pathAvatar: string; // Đường dẫn ảnh local

  @Column({ nullable: true })
  phone: string;

  @Column()
  dob: string; // Ngày sinh

  @Column()
  username: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}