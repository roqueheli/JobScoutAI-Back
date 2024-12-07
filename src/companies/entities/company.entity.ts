import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { JobPost } from '../../job-posts/entities/job-post.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  company_size: string;

  @Column({ type: 'year', nullable: true })
  founded_year: number;

  @Column({ nullable: true })
  location: string;

  @Column({ default: false })
  is_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => JobPost, jobPost => jobPost.company)
  job_posts: JobPost[];
}