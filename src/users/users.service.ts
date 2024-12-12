import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Skill } from "src/skills/entities/skill.entity";
import { In, Repository } from "typeorm";
import { GoogleDriveService } from "../shared/google-drive/google-drive.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Skill)
        private skillsRepository: Repository<Skill>,
        private readonly googleDriveService: GoogleDriveService,
    ) { }

    async getProfile(userId: string) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['skills'],
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['skills'],
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Actualizar campos básicos  
        Object.assign(user, updateProfileDto);

        if (updateProfileDto.languages) {
            user.languages = updateProfileDto.languages; // Almacena el arreglo de idiomas  
        }

        // Actualizar skills si se proporcionaron  
        if (updateProfileDto.skills) {
            const skills = await this.skillsRepository.findBy({
                name: In(updateProfileDto.skills),
            });
            user.skills = skills;
        }

        return this.usersRepository.save(user);
    }

    async uploadResume(userId: string, file: Express.Multer.File) {
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        try {
            if (user.resume_url) {
                const oldFileId = this.extractFileIdFromUrl(user.resume_url);
                if (oldFileId) {
                    await this.googleDriveService.deleteFile(oldFileId);
                }
            }

            const fileUrl = await this.googleDriveService.uploadFile(file);

            user.resume_url = fileUrl;
            await this.usersRepository.save(user);

            return {
                message: 'Resume uploaded successfully',
                resumeUrl: fileUrl
            };
        } catch (error) {
            throw new Error(`Failed to upload resume: ${error.message}`);
        }
    }

    async deleteResume(userId: string): Promise<void> {
        // Busca al usuario en la base de datos  
        const user = await this.usersRepository.findOne({
            where: { id: userId }, // Especifica que estás buscando por el ID  
        });
        if (!user || !user.resume_url) {
            throw new Error('No resume found for this user');
        }

        // Elimina el archivo de Google Drive  
        const fileId = this.extractFileIdFromUrl(user.resume_url); // Implementa esta función para extraer el ID del archivo de la URL  
        if (fileId) {
            await this.googleDriveService.deleteFile(fileId); // Llama al método de eliminación del servicio de Google Drive  
        }

        // Actualiza el campo resume_url en la base de datos  
        user.resume_url = null; // Elimina la URL del resume  
        await this.usersRepository.save(user); // Guarda los cambios en la base de datos  
    }

    private extractFileIdFromUrl(url: string): string | null {
        const regex = /[-\w]{25,}/; // Expresión regular para encontrar el ID del archivo  
        const matches = url.match(regex);
        return matches ? matches[0] : null; // Devuelve el ID o null si no se encuentra  
    }

    async uploadProfilePicture(userId: string, file: Express.Multer.File): Promise<string> {
        const user = await this.usersRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        try {
            // Si ya existe una foto de perfil, eliminarla de Google Drive  
            if (user.profile_picture) {
                const oldFileId = this.extractFileIdFromUrl(user.profile_picture);
                if (oldFileId) {
                    await this.googleDriveService.deleteFile(oldFileId);
                }
            }

            // Subir la nueva foto de perfil a Google Drive  
            const fileUrl = await this.googleDriveService.uploadFile(file);

            // Actualizar el campo `profile_picture` en la base de datos  
            user.profile_picture = fileUrl;
            await this.usersRepository.save(user);

            return fileUrl;
        } catch (error) {
            throw new Error(`Failed to upload profile picture: ${error.message}`);
        }
    }
}
