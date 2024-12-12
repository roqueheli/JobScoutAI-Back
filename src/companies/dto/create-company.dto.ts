export class CreateCompanyDto {  
  name: string;  
  description?: string;  
  logo_url?: string;  
  website?: string;  
  industry?: string;  
  company_size?: string;  
  founded_year?: number;  
  location?: string;  
  is_verified?: boolean;  
}