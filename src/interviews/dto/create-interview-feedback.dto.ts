import { IsEnum, IsNotEmpty, IsInt, IsString, IsOptional, Min, Max } from 'class-validator';
import { Recommendation } from '../entities/interview-feedback.entity';

export class CreateInterviewFeedbackDto {
  @IsNotEmpty()
  @IsString()
  interview_id: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  technical_score?: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  communication_score?: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  cultural_fit_score?: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  overall_score?: number;

  @IsString()
  @IsOptional()
  strengths?: string;

  @IsString()
  @IsOptional()
  weaknesses?: string;

  @IsEnum(Recommendation)
  recommendation: Recommendation;

  @IsString()
  @IsOptional()
  notes?: string;
}