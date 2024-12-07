import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { JobPost } from '../../job-posts/entities/job-post.entity';

@Entity('job_skills')
export class JobSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => JobPost, { onDelete: 'CASCADE' })
  job_post: JobPost;

  @Column()
  skill_name: string;

  @Column({ default: true })
  is_required: boolean;
}