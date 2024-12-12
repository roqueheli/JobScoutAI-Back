import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyAdmin } from 'src/company-admin/company-admin.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(CompanyAdmin)
    private companyAdminsRepository: Repository<CompanyAdmin>,
  ) { }

  async create(createCompanyDto: CreateCompanyDto, userId: string): Promise<Company> {
    const user = await this.usersRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Crear la compañía  
    const company = this.companiesRepository.create(createCompanyDto);
    const savedCompany = await this.companiesRepository.save(company);

    // Crear la relación en company_admins  
    const companyAdmin = this.companyAdminsRepository.create({
      user,
      company: savedCompany
    });
    await this.companyAdminsRepository.save(companyAdmin);

    // Actualizar el rol del usuario si es necesario  
    if (user.role !== 'COMPANY_ADMIN') {
      user.role = 'COMPANY_ADMIN';
      await this.usersRepository.save(user);
    }

    return savedCompany;
  }

  async findAll(): Promise<Company[]> {
    return this.companiesRepository.find({
      relations: ['companyAdmins', 'companyAdmins.user', 'job_posts']
    });
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: ['companyAdmins', 'companyAdmins.user', 'job_posts']
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async update(id: string, updateCompanyDto: Partial<CreateCompanyDto>): Promise<Company> {
    const company = await this.findOne(id);
    Object.assign(company, updateCompanyDto);
    return this.companiesRepository.save(company);
  }

  async remove(id: string): Promise<void> {
    const result = await this.companiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
  }

  async addAdmin(companyId: string, userId: string): Promise<void> {
    const [company, user] = await Promise.all([
      this.findOne(companyId),
      this.usersRepository.findOne({ where: { id: userId } })
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verificar si ya existe la relación  
    const existingAdmin = await this.companyAdminsRepository.findOne({
      where: { user: { id: userId }, company: { id: companyId } }
    });

    if (!existingAdmin) {
      const companyAdmin = this.companyAdminsRepository.create({
        user,
        company
      });
      await this.companyAdminsRepository.save(companyAdmin);
    }

    // Actualizar el rol del usuario si es necesario  
    if (user.role !== 'COMPANY_ADMIN') {
      user.role = 'COMPANY_ADMIN';
      await this.usersRepository.save(user);
    }
  }

  async removeAdmin(companyId: string, userId: string): Promise<void> {
    const companyAdmin = await this.companyAdminsRepository.findOne({
      where: {
        userId: userId,
        companyId: companyId
      }
    });

    if (!companyAdmin) {
      throw new NotFoundException(`Admin relationship not found`);
    }

    await this.companyAdminsRepository.remove(companyAdmin);

    // Verificar si el usuario es admin de otras compañías  
    const otherAdminRoles = await this.companyAdminsRepository.count({
      where: { userId: userId }
    });

    if (otherAdminRoles === 0) {
      const user = await this.usersRepository.findOne({
        where: { id: userId }
      });
      if (user && user.role === 'COMPANY_ADMIN') {
        user.role = 'APPLICANT';
        await this.usersRepository.save(user);
      }
    }
  }

  async getCompanyAdmins(companyId: string): Promise<User[]> {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
      relations: ['companyAdmins', 'companyAdmins.user']
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    return company.companyAdmins.map(admin => admin.user);
  }

  async getUserCompanies(userId: string): Promise<Company[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['companyAdmins', 'companyAdmins.company']
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.companyAdmins.map(admin => admin.company);
  }
}
