import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    first_name?: string;

    @IsString()
    @IsOptional()
    last_name?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    profession?: string;

    @IsString()
    @IsOptional()
    location?: string;

    @IsString()
    @IsOptional()
    bio?: string;

    @IsString()
    @IsOptional()
    experience_years?: string;

    @IsString()
    @IsOptional()
    education?: string;

    @IsArray()
    @IsOptional()
    languages?: string[];

    @IsString()
    @IsOptional()
    website?: string;

    @IsString()
    @IsOptional()
    linkedin_url?: string;

    @IsString()
    @IsOptional()
    github_url?: string;

    @IsArray()
    @IsOptional()
    skills?: string[];
}