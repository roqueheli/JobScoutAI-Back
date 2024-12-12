import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CompanyAdmin } from 'src/company-admin/company-admin.entity';
import { Repository } from 'typeorm';
import { Company } from '../companies/entities/company.entity';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(CompanyAdmin)
    private companyAdminsRepository: Repository<CompanyAdmin>,
    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    // Verificar si el email ya existe    
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Crear el usuario    
    const user = this.usersRepository.create({
      ...registerDto,
      password_hash: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    // Si es un COMPANY_ADMIN, crear la relación con la compañía    
    let adminCompanies = [];
    if (registerDto.role === 'COMPANY_ADMIN' && registerDto.companyId) {
      const company = await this.companiesRepository.findOne({
        where: { id: registerDto.companyId }
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      const companyAdmin = this.companyAdminsRepository.create({
        user: savedUser,
        company
      });
      await this.companyAdminsRepository.save(companyAdmin);

      adminCompanies = [{
        id: company.id,
        name: company.name
      }];
    }

    // Crear el payload del token  
    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
      adminCompanies: adminCompanies
    };

    // Retornar la misma estructura que el login  
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        first_name: savedUser.first_name,
        last_name: savedUser.last_name,
        adminCompanies: adminCompanies
      },
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
      relations: ['companyAdmins', 'companyAdmins.company']
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Obtener las compañías administradas si el usuario es COMPANY_ADMIN  
    let adminCompanies = [];
    if (user.role === 'COMPANY_ADMIN') {
      adminCompanies = user.companyAdmins.map(admin => ({
        id: admin.company.id,
        name: admin.company.name
      }));
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      adminCompanies: adminCompanies
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        adminCompanies: adminCompanies
      },
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['companyAdmins', 'companyAdmins.company']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.findById(id);

    if (!user.is_active) {
      throw new UnauthorizedException('User is inactive');
    }

    return user;
  }

  async isCompanyAdmin(userId: string, companyId: string): Promise<boolean> {
    const companyAdmin = await this.companyAdminsRepository.findOne({
      where: {
        user: { id: userId },
        company: { id: companyId }
      }
    });

    return !!companyAdmin;
  }
}
