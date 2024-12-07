import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'ADMIN',
  APPLICANT = 'APPLICANT',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password_hash: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.APPLICANT,
  })
  role: UserRole;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  profile_picture?: string;

  @Column({ nullable: true })
  resume_url?: string;

  @Column({ nullable: true })
  linkedin_url?: string;

  @Column({ nullable: true })
  github_url?: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}