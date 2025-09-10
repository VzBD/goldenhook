import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;
  
  @Column({ unique: true, nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string; // 'user' | 'admin'

  @Column({ type: 'float', default: 0 })
  balance: number;

  @Column({ nullable: true })
  activationToken: string;

  @Column({ type: 'datetime', nullable: true })
  activationExpiresAt: Date | null;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ type: 'datetime', nullable: true })
  passwordResetExpiresAt: Date | null;

  @Column({ nullable: true })
  phoneVerificationCode: string | null;

  @Column({ type: 'datetime', nullable: true })
  phoneCodeExpiresAt: Date | null;
}
