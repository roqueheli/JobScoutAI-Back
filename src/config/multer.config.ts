import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import multer from 'multer';

export const multerConfig: MulterOptions = {
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Verificar el tipo de archivo
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf'
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(
                new BadRequestException(
                    `File type not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`
                ),
                false
            );
        }
        cb(null, true);
    },
};