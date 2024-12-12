import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { memoryStorage } from 'multer';
import { GoogleDriveModule } from '../shared/google-drive/google-drive.module';
import { Skill } from '../skills/entities/skill.entity';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        MulterModule.register({
            storage: memoryStorage(),
        }),
        TypeOrmModule.forFeature([User, Skill]),
        GoogleDriveModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }