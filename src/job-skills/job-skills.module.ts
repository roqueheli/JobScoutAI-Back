import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobSkillsController } from './job-skills.controller';
import { JobSkillsService } from './job-skills.service';
import { JobSkill } from './entities/job-skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobSkill])],
  controllers: [JobSkillsController],
  providers: [JobSkillsService],
  exports: [JobSkillsService],
})
export class JobSkillsModule {}