import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StageTransition } from './entities/stage-transition.entity';
import { CreateStageTransitionDto } from './dto/create-stage-transition.dto';
import { Application } from '../applications/entities/application.entity';

@Injectable()
export class StageTransitionsService {
  constructor(
    @InjectRepository(StageTransition)
    private stageTransitionsRepository: Repository<StageTransition>,
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
  ) {}

  async create(createStageTransitionDto: CreateStageTransitionDto): Promise<StageTransition> {
    const application = await this.applicationsRepository.findOne({
      where: { id: createStageTransitionDto.application_id },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${createStageTransitionDto.application_id} not found`);
    }

    if (application.current_stage !== createStageTransitionDto.from_stage) {
      throw new BadRequestException('Current stage does not match the from_stage');
    }

    const stageTransition = this.stageTransitionsRepository.create(createStageTransitionDto);
    
    // Update application's current stage
    application.current_stage = createStageTransitionDto.to_stage;
    await this.applicationsRepository.save(application);

    return this.stageTransitionsRepository.save(stageTransition);
  }

  async findAll(): Promise<StageTransition[]> {
    return this.stageTransitionsRepository.find({
      relations: ['application', 'transitioned_by'],
    });
  }

  async findByApplication(applicationId: string): Promise<StageTransition[]> {
    return this.stageTransitionsRepository.find({
      where: { application: { id: applicationId } },
      relations: ['application', 'transitioned_by'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<StageTransition> {
    const stageTransition = await this.stageTransitionsRepository.findOne({
      where: { id },
      relations: ['application', 'transitioned_by'],
    });
    if (!stageTransition) {
      throw new NotFoundException(`Stage transition with ID ${id} not found`);
    }
    return stageTransition;
  }
}