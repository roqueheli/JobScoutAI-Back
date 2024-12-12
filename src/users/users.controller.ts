import {
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
import { unlink } from "fs";
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { GoogleDriveService } from "src/shared/google-drive/google-drive.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly googleDriveService: GoogleDriveService,) { }

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
            storage: diskStorage({
                destination: './uploads/temp',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    cb(null, `resume-${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (file.mimetype !== 'application/pdf') {
                    return cb(new Error('Only PDF files are allowed!'), false);
                }
                cb(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024 // 5MB  
            }
        })
    )
    async uploadResume(
        @Request() req,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: 'pdf' }),
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB  
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        try {
            const resumeUrl = await this.usersService.uploadResume(req.user.id, file);
            // Luego de subir el archivo, eliminar el archivo temporal para liberar espacio
            const tempFilePath = join('./uploads/temp', file.filename);
            unlink(tempFilePath, (err) => {
                if (err) {
                    console.error('Error deleting temporary file:', err);
                }
            });

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
        const userId = req.user.id; // Obtener el ID del usuario desde el token    
        const user = await this.usersService.getProfile(userId); // Obtener el usuario    

        if (!user || !user.resume_url) {
            throw new NotFoundException('Resume not found'); // Manejo de errores si no se encuentra el currículum    
        }

        const resumeFileId = user.resume_url; // Suponiendo que resume_url contiene el ID del archivo en Google Drive    
        const destinationPath = join(__dirname, '../../../downloads', 'resume.pdf'); // Ruta donde se guardará el archivo    

        try {
            // Asegúrate de que la carpeta de destino exista  
            const fs = require('fs');
            const dir = join(__dirname, '../../../downloads');
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Descarga el archivo desde Google Drive  
            await this.googleDriveService.downloadFile(resumeFileId, destinationPath);

            // Configura la respuesta para la descarga    
            res.download(destinationPath, 'resume.pdf', (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                    res.status(500).send('Error downloading file');
                }
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
            storage: diskStorage({
                destination: './uploads/temp',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    cb(null, `profile-${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
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

            if (profilePictureUrl) {
                //Eliminar el archivo temporal después de subirlo  
                const tempFilePath = join('./uploads/temp', file.filename);
                unlink(tempFilePath, (err) => {
                    if (err) {
                        console.error('Error deleting temporary file:', err);
                    }
                });
            }

            console.log('profilePictureUrl', profilePictureUrl);
            
            return {
                message: 'Profile picture uploaded successfully',
                profilePictureUrl,
            };
        } catch (error) {
            throw new Error(`Failed to upload profile picture: ${error.message}`);
        }
    }
}
