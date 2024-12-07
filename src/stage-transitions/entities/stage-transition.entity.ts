import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';
import { User } from '../../users/entities/user.entity';
import { ApplicationStage } from '../../applications/entities/application.entity';

@Entity('stage_transitions')
export class StageTransition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Application, { onDelete: 'CASCADE' })
  application: Application;

  @Column({
    type: 'enum',
    enum: ApplicationStage,
  })
  from_stage: ApplicationStage;

  @Column({
    type: 'enum',
    enum: ApplicationStage,
  })
  to_stage: ApplicationStage;

  @ManyToOne(() => User)
  transitioned_by: User;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;
}