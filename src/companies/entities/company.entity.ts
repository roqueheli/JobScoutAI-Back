import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CompanyAdmin } from '../../company-admin/company-admin.entity';
import { JobPost } from '../../job-posts/entities/job-post.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
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

  @OneToMany(() => CompanyAdmin, companyAdmin => companyAdmin.company)
  companyAdmins: CompanyAdmin[];
}
