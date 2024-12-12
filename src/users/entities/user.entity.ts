import { Skill } from 'src/skills/entities/skill.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CompanyAdmin } from '../../company-admin/company-admin.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'APPLICANT'],
    default: 'APPLICANT'
  })
  role: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ nullable: true })
  profession: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  experience_years: string;

  @Column({ nullable: true })
  education: string;

  @Column({ type: 'json', nullable: true })
  languages: string[];

  @Column({ nullable: true })
  resume_url: string;

  @Column({ nullable: true })
  linkedin_url: string;

  @Column({ nullable: true })
  github_url: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  website: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => CompanyAdmin, companyAdmin => companyAdmin.user)
  companyAdmins: CompanyAdmin[];

  @ManyToMany(() => Skill)
  @JoinTable({
    name: 'user_skills',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'skill_id' }
  })
  skills: Skill[];
}
