import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StageTransitionsService } from './stage-transitions.service';
import { CreateStageTransitionDto } from './dto/create-stage-transition.dto';

@Controller('stage-transitions')
@UseGuards(JwtAuthGuard)
export class StageTransitionsController {
  constructor(private readonly stageTransitionsService: StageTransitionsService) {}

  @Post()
  create(@Body() createStageTransitionDto: CreateStageTransitionDto) {
    return this.stageTransitionsService.create(createStageTransitionDto);
  }

  @Get()
  findAll() {
    return this.stageTransitionsService.findAll();
  }

  @Get('application/:applicationId')
  findByApplication(@Param('applicationId') applicationId: string) {
    return this.stageTransitionsService.findByApplication(applicationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stageTransitionsService.findOne(id);
  }
}