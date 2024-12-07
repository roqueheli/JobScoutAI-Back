import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StageTransitionsController } from './stage-transitions.controller';
import { StageTransitionsService } from './stage-transitions.service';
import { StageTransition } from './entities/stage-transition.entity';
import { Application } from '../applications/entities/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StageTransition, Application])],
  controllers: [StageTransitionsController],
  providers: [StageTransitionsService],
  exports: [StageTransitionsService],
})
export class StageTransitionsModule {}