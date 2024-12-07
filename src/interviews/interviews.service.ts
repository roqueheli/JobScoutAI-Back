import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview, InterviewStatus } from './entities/interview.entity';
import { InterviewFeedback } from './entities/interview-feedback.entity';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { CreateInterviewFeedbackDto } from './dto/create-interview-feedback.dto';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(Interview)
    private interviewsRepository: Repository<Interview>,
    @InjectRepository(InterviewFeedback)
    private feedbackRepository: Repository<InterviewFeedback>,
  ) {}

  async createInterview(createInterviewDto: CreateInterviewDto): Promise<Interview> {
    const interview = this.interviewsRepository.create(createInterviewDto);
    return this.interviewsRepository.save(interview);
  }

  async findAllInterviews(): Promise<Interview[]> {
    return this.interviewsRepository.find({
      relations: ['application', 'interviewer'],
    });
  }

  async findInterviewById(id: string): Promise<Interview> {
    const interview = await this.interviewsRepository.findOne({
      where: { id },
      relations: ['application', 'interviewer'],
    });
    if (!interview) {
      throw new NotFoundException(`Interview with ID ${id} not found`);
    }
    return interview;
  }

  async updateInterview(id: string, updateData: Partial<CreateInterviewDto>): Promise<Interview> {
    const interview = await this.findInterviewById(id);
    Object.assign(interview, updateData);
    return this.interviewsRepository.save(interview);
  }

  async cancelInterview(id: string): Promise<Interview> {
    const interview = await this.findInterviewById(id);
    interview.status = InterviewStatus.CANCELLED;
    return this.interviewsRepository.save(interview);
  }

  async createFeedback(createFeedbackDto: CreateInterviewFeedbackDto): Promise<InterviewFeedback> {
    const interview = await this.findInterviewById(createFeedbackDto.interview_id);
    
    if (interview.status !== InterviewStatus.COMPLETED) {
      throw new BadRequestException('Cannot provide feedback for an interview that is not completed');
    }

    const existingFeedback = await this.feedbackRepository.findOne({
      where: { interview: { id: interview.id } },
    });

    if (existingFeedback) {
      throw new BadRequestException('Feedback already exists for this interview');
    }

    const feedback = this.feedbackRepository.create({
      ...createFeedbackDto,
      interview,
    });

    return this.feedbackRepository.save(feedback);
  }

  async findFeedbackByInterviewId(interviewId: string): Promise<InterviewFeedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { interview: { id: interviewId } },
      relations: ['interview'],
    });
    
    if (!feedback) {
      throw new NotFoundException(`Feedback for interview ID ${interviewId} not found`);
    }
    
    return feedback;
  }

  async updateFeedback(
    interviewId: string,
    updateData: Partial<CreateInterviewFeedbackDto>,
  ): Promise<InterviewFeedback> {
    const feedback = await this.findFeedbackByInterviewId(interviewId);
    Object.assign(feedback, updateData);
    return this.feedbackRepository.save(feedback);
  }
}