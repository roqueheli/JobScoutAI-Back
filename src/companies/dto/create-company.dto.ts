import { IsString, IsOptional, IsUrl, IsInt, Min, Max, IsBoolean } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  logo_url?: string;

  @IsUrl()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  company_size?: string;

  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear())
  @IsOptional()
  founded_year?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  is_verified?: boolean;
}