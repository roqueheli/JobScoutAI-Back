import { JobPost } from "src/job-posts/entities/job-post.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('job_skills')
export class JobSkill {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ type: 'bigint', unsigned: true })
  job_post_id: string;

  @Column()
  skill_name: string;

  @Column()
  is_required: boolean;

  @ManyToOne(() => JobPost, jobPost => jobPost.job_skills)
  job_post: JobPost;
}
