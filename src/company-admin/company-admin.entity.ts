import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { User } from '../users/entities/user.entity';

@Entity('company_admins')
export class CompanyAdmin {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ type: 'bigint', unsigned: true })
  userId: string;

  @Column({ type: 'bigint', unsigned: true })
  companyId: string;

  @ManyToOne(() => User, user => user.companyAdmins)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Company, company => company.companyAdmins)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @CreateDateColumn()
  created_at: Date;
}
