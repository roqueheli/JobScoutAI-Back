import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobSkill } from './entities/job-skill.entity';
import { CreateJobSkillDto } from './dto/create-job-skill.dto';

@Injectable()
export class JobSkillsService {
  constructor(
    @InjectRepository(JobSkill)
    private jobSkillsRepository: Repository<JobSkill>,
  ) {}

  async create(createJobSkillDto: CreateJobSkillDto): Promise<JobSkill> {
    const jobSkill = this.jobSkillsRepository.create(createJobSkillDto);
    return this.jobSkillsRepository.save(jobSkill);
  }

  async findAll(): Promise<JobSkill[]> {
    return this.jobSkillsRepository.find({
      relations: ['job_post'],
    });
  }

  async findByJobPost(jobPostId: string): Promise<JobSkill[]> {
    return this.jobSkillsRepository.find({
      where: { job_post: { id: jobPostId } },
      relations: ['job_post'],
    });
  }

  async findOne(id: string): Promise<JobSkill> {
    const jobSkill = await this.jobSkillsRepository.findOne({
      where: { id },
      relations: ['job_post'],
    });
    if (!jobSkill) {
      throw new NotFoundException(`Job skill with ID ${id} not found`);
    }
    return jobSkill;
  }

  async update(id: string, updateJobSkillDto: Partial<CreateJobSkillDto>): Promise<JobSkill> {
    const jobSkill = await this.findOne(id);
    Object.assign(jobSkill, updateJobSkillDto);
    return this.jobSkillsRepository.save(jobSkill);
  }

  async remove(id: string): Promise<void> {
    const result = await this.jobSkillsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Job skill with ID ${id} not found`);
    }
  }
}