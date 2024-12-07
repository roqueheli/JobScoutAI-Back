import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';
import { User } from '../../users/entities/user.entity';

export enum InterviewType {
  PHONE = 'PHONE',
  VIDEO = 'VIDEO',
  ON_SITE = 'ON_SITE',
  TECHNICAL = 'TECHNICAL',
}

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
}

@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Application, { onDelete: 'CASCADE' })
  application: Application;

  @ManyToOne(() => User)
  interviewer: User;

  @Column({
    type: 'enum',
    enum: InterviewType,
  })
  type: InterviewType;

  @Column({ type: 'datetime' })
  scheduled_at: Date;

  @Column()
  duration_minutes: number;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  meeting_link: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  reschedule_count: number;

  @Column({
    type: 'enum',
    enum: InterviewStatus,
    default: InterviewStatus.SCHEDULED,
  })
  status: InterviewStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}