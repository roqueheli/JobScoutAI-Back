import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JobSkillsService } from './job-skills.service';
import { CreateJobSkillDto } from './dto/create-job-skill.dto';

@Controller('job-skills')
@UseGuards(JwtAuthGuard)
export class JobSkillsController {
  constructor(private readonly jobSkillsService: JobSkillsService) {}

  @Post()
  create(@Body() createJobSkillDto: CreateJobSkillDto) {
    return this.jobSkillsService.create(createJobSkillDto);
  }

  @Get()
  findAll() {
    return this.jobSkillsService.findAll();
  }

  @Get('job-post/:jobPostId')
  findByJobPost(@Param('jobPostId') jobPostId: string) {
    return this.jobSkillsService.findByJobPost(jobPostId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobSkillsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobSkillDto: Partial<CreateJobSkillDto>) {
    return this.jobSkillsService.update(id, updateJobSkillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobSkillsService.remove(id);
  }
}