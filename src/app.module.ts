import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { InterviewsModule } from './interviews/interviews.module';
import { JobSkillsModule } from './job-skills/job-skills.module';
import { StageTransitionsModule } from './stage-transitions/stage-transitions.module';
import { UploadModule } from './upload/upload.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CompaniesModule,
    InterviewsModule,
    JobSkillsModule,
    StageTransitionsModule,
    UsersModule,
    UploadModule,
  ],
})

export class AppModule { }
