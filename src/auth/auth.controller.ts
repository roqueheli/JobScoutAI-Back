import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    const user = await this.authService.findById(req.user.sub);
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      phone: user.phone,
      profile_picture: user.profile_picture,
      resume_url: user.resume_url,
      linkedin_url: user.linkedin_url,
      github_url: user.github_url,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
      adminCompanies: user.companyAdmins?.map(admin => ({
        id: admin.company.id,
        name: admin.company.name
      })) || []
    };
  }
}
