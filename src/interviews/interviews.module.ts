import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { Interview } from './entities/interview.entity';
import { InterviewFeedback } from './entities/interview-feedback.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview, InterviewFeedback])],
  controllers: [InterviewsController],
  providers: [InterviewsService],
  exports: [InterviewsService],
})
export class InterviewsModule {}