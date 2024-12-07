import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApplicationStage } from '../../applications/entities/application.entity';

export class CreateStageTransitionDto {
  @IsNotEmpty()
  @IsString()
  application_id: string;

  @IsEnum(ApplicationStage)
  from_stage: ApplicationStage;

  @IsEnum(ApplicationStage)
  to_stage: ApplicationStage;

  @IsNotEmpty()
  @IsString()
  transitioned_by_id: string;

  @IsString()
  @IsOptional()
  notes?: string;
}