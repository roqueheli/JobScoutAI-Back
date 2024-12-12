import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyAdmin } from "src/company-admin/company-admin.entity";
import { User } from "src/users/entities/user.entity";
import { CompaniesController } from "./companies.controller";
import { CompaniesService } from "./companies.service";
import { Company } from "./entities/company.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, User, CompanyAdmin]),
  ],
  providers: [CompaniesService],
  controllers: [CompaniesController],
})

export class CompaniesModule { }