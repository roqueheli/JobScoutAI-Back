import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { JobPost } from '../../job-posts/entities/job-post.entity';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEWING = 'INTERVIEWING',
  OFFERED = 'OFFERED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum ApplicationStage {
  INITIAL_REVIEW = 'INITIAL_REVIEW',
  TECHNICAL_ASSESSMENT = 'TECHNICAL_ASSESSMENT',
  FIRST_INTERVIEW = 'FIRST_INTERVIEW',
  SECOND_INTERVIEW = 'SECOND_INTERVIEW',
  FINAL_INTERVIEW = 'FINAL_INTERVIEW',
  OFFER = 'OFFER',
  COMPLETED = 'COMPLETED',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => JobPost, jobPost => jobPost.applications)
  job_post: JobPost;

  @ManyToOne(() => User)
  applicant: User;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column('text', { nullable: true })
  cover_letter: string;

  @Column()
  resume_version: string;

  @Column({
    type: 'enum',
    enum: ApplicationStage,
    default: ApplicationStage.INITIAL_REVIEW,
  })
  current_stage: ApplicationStage;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}