import { IsEnum, IsNotEmpty, IsDate, IsInt, IsString, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { InterviewType } from '../entities/interview.entity';

export class CreateInterviewDto {
  @IsNotEmpty()
  @IsString()
  application_id: string;

  @IsNotEmpty()
  @IsString()
  interviewer_id: string;

  @IsEnum(InterviewType)
  type: InterviewType;

  @IsDate()
  @Type(() => Date)
  scheduled_at: Date;

  @IsInt()
  @Min(15)
  @Max(240)
  duration_minutes: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  meeting_link?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}