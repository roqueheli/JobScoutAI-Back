import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEnum(['ADMIN', 'COMPANY_ADMIN', 'INTERVIEWER', 'APPLICANT'])
  role: string;

  @IsOptional()
  @IsUUID()
  companyId?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;
}
