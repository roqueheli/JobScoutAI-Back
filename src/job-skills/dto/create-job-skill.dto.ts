import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateJobSkillDto {
  @IsNotEmpty()
  @IsString()
  job_post_id: string;

  @IsNotEmpty()
  @IsString()
  skill_name: string;

  @IsBoolean()
  @IsOptional()
  is_required?: boolean;
}