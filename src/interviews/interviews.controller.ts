import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { CreateInterviewFeedbackDto } from './dto/create-interview-feedback.dto';

@Controller('interviews')
@UseGuards(JwtAuthGuard)
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  createInterview(@Body() createInterviewDto: CreateInterviewDto) {
    return this.interviewsService.createInterview(createInterviewDto);
  }

  @Get()
  findAllInterviews() {
    return this.interviewsService.findAllInterviews();
  }

  @Get(':id')
  findInterviewById(@Param('id') id: string) {
    return this.interviewsService.findInterviewById(id);
  }

  @Patch(':id')
  updateInterview(
    @Param('id') id: string,
    @Body() updateInterviewDto: Partial<CreateInterviewDto>,
  ) {
    return this.interviewsService.updateInterview(id, updateInterviewDto);
  }

  @Delete(':id')
  cancelInterview(@Param('id') id: string) {
    return this.interviewsService.cancelInterview(id);
  }

  @Post(':id/feedback')
  createFeedback(
    @Param('id') id: string,
    @Body() createFeedbackDto: CreateInterviewFeedbackDto,
  ) {
    return this.interviewsService.createFeedback({
      ...createFeedbackDto,
      interview_id: id,
    });
  }

  @Get(':id/feedback')
  getFeedback(@Param('id') id: string) {
    return this.interviewsService.findFeedbackByInterviewId(id);
  }

  @Patch(':id/feedback')
  updateFeedback(
    @Param('id') id: string,
    @Body() updateFeedbackDto: Partial<CreateInterviewFeedbackDto>,
  ) {
    return this.interviewsService.updateFeedback(id, updateFeedbackDto);
  }
}