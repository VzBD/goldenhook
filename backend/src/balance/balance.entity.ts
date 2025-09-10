import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id)
  user: User;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'varchar', length: 32 })
  type: string; // 'deposit' | 'withdrawal'

  @CreateDateColumn()
  createdAt: Date;
}
