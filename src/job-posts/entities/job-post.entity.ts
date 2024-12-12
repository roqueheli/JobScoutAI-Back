import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';
import { Company } from '../../companies/entities/company.entity';
import { JobSkill } from '../../job-skills/entities/job-skill.entity';

export enum LocationType {
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
  ON_SITE = 'ON_SITE',
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
}

export enum ExperienceLevel {
  ENTRY = 'ENTRY',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
  EXECUTIVE = 'EXECUTIVE',
}

export enum JobStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
}

@Entity('job_posts')
export class JobPost {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ type: 'bigint', unsigned: true })
  company_id: string;

  @ManyToOne(() => Company, company => company.job_posts)
  company: Company;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  requirements: string;

  @Column('text')
  responsibilities: string;

  @Column({
    type: 'enum',
    enum: LocationType,
  })
  location_type: LocationType;

  @Column({ nullable: true })
  location: string;

  @Column({
    type: 'enum',
    enum: EmploymentType,
  })
  employment_type: EmploymentType;

  @Column({
    type: 'enum',
    enum: ExperienceLevel,
  })
  experience_level: ExperienceLevel;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  salary_min: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  salary_max: number;

  @Column({ length: 3, nullable: true })
  salary_currency: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.DRAFT,
  })
  status: JobStatus;

  @Column({ type: 'date' })
  application_deadline: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Application, application => application.job_post)
  applications: Application[];

  @OneToMany(() => JobSkill, jobSkill => jobSkill.job_post)
  job_skills: JobSkill[];
}
