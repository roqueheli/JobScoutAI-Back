import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Interview } from './interview.entity';

export enum Recommendation {
  STRONG_YES = 'STRONG_YES',
  YES = 'YES',
  MAYBE = 'MAYBE',
  NO = 'NO',
  STRONG_NO = 'STRONG_NO',
}

@Entity('interview_feedback')
export class InterviewFeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Interview, { onDelete: 'CASCADE' })
  @JoinColumn()
  interview: Interview;

  @Column({ type: 'tinyint', nullable: true })
  technical_score: number;

  @Column({ type: 'tinyint', nullable: true })
  communication_score: number;

  @Column({ type: 'tinyint', nullable: true })
  cultural_fit_score: number;

  @Column({ type: 'tinyint', nullable: true })
  overall_score: number;

  @Column({ type: 'text', nullable: true })
  strengths: string;

  @Column({ type: 'text', nullable: true })
  weaknesses: string;

  @Column({
    type: 'enum',
    enum: Recommendation,
  })
  recommendation: Recommendation;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}