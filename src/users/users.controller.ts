import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    FileTypeValidator,
    Get,
    MaxFileSizeValidator,
    NotFoundException,
    ParseFilePipe,
    Patch,
    Post,
    Request,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from 'express';
import { existsSync, mkdirSync, unlinkSync } from "fs";
import { memoryStorage } from 'multer';
import { join } from 'path';
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { GoogleDriveService } from "src/shared/google-drive/google-drive.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly googleDriveService: GoogleDriveService,
    ) { }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Request() req) {
        return this.usersService.getProfile(req.user.id);
    }

    @Patch('profile')
    @UseGuards(JwtAuthGuard)
    updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.usersService.updateProfile(req.user.id, updateProfileDto);
    }

    @Post('profile/resume')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('resume', {
            storage: memoryStorage(),
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB limit
            },
            fileFilter: (req, file, cb) => {
                if (file.mimetype !== 'application/pdf') {
                    return cb(new Error('Only PDF files are allowed!'), false);
                }
                cb(null, true);
            },
        })
    )
    async uploadResume(
        @UploadedFile() file: Express.Multer.File,
        @Request() req,
    ) {
        try {
            if (!file) {
                throw new BadRequestException('No file uploaded');
            }

            const resumeUrl = await this.usersService.uploadResume(req.user.id, file);

            return resumeUrl;
        } catch (error) {
            throw new Error(`Failed to upload resume: ${error.message}`);
        }
    }

    @Delete('profile/resume')
    @UseGuards(JwtAuthGuard)
    async deleteResume(@Request() req) {
        try {
            await this.usersService.deleteResume(req.user.id); // Llama al servicio para eliminar el resume  
            return { message: 'Resume deleted successfully' };
        } catch (error) {
            throw new Error(`Failed to delete resume: ${error.message}`);
        }
    }

    @Get('download/resume')
    @UseGuards(JwtAuthGuard)
    async downloadResume(@Request() req, @Res() res: Response) {
        const user = await this.usersService.getProfile(req.user.id); // Obtener el usuario    

        if (!user || !user.resume_url) {
            throw new NotFoundException('Resume not found'); // Manejo de errores si no se encuentra el currículum    
        }

        const resumeName = `resume_${user.first_name}_${user.last_name}.pdf`;

        try {
            const fileId = this.extractFileId(user.resume_url);

            // Crear directorio temporal si no existe
            const dir = join(__dirname, '../../../downloads');
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
            }

            const destinationPath = join(dir, resumeName);

            // Descargar el archivo
            await this.googleDriveService.downloadFile(fileId, destinationPath);
            // Enviar el archivo
            res.download(destinationPath, resumeName, (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                    res.status(500).send('Error downloading file');
                }
                // Eliminar el archivo temporal después de enviarlo
                unlinkSync(destinationPath);
            });
        } catch (error) {
            console.error('Error during file download:', error);
            res.status(500).send('Error during file download');
        }
    }

    @Post('profile/picture')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('profile_picture', {
            storage: memoryStorage(),
            fileFilter: (req, file, cb) => {
                // Validar que el archivo sea una imagen  
                if (!file.mimetype.startsWith('image/')) {
                    return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB  
            },
        }),
    )
    async uploadProfilePicture(
        @Request() req,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: /image\/(jpeg|png|gif)/ }), // Solo imágenes JPEG, PNG o GIF  
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB  
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        try {

            // Llamar al servicio para subir la foto de perfil  
            const profilePictureUrl = await this.usersService.uploadProfilePicture(req.user.id, file);

            return {
                message: 'Profile picture uploaded successfully',
                profilePictureUrl,
            };
        } catch (error) {
            throw new Error(`Failed to upload profile picture: ${error.message}`);
        }
    }

    private extractFileId(url: string): string {
        // Si la URL ya es un ID, retornarlo directamente
        if (!url.includes('/')) {
            return url;
        }

        // Extraer el ID de la URL de Google Drive
        const matches = url.match(/[-\w]{25,}/);
        if (!matches) {
            throw new BadRequestException('Invalid Google Drive URL');
        }
        return matches[0];
    }
}
