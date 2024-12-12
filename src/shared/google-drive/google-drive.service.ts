import { Injectable } from '@nestjs/common';
import { createWriteStream, readFileSync } from 'fs';
import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import { join } from 'path';
import { Readable } from 'typeorm/platform/PlatformTools';

@Injectable()
export class GoogleDriveService {
    private drive;
    private auth: GoogleAuth;

    constructor() {
        const credentialsPath = join(__dirname, '../../../credentials.json');
        const credentials = JSON.parse(readFileSync(credentialsPath, 'utf-8'));
        const { client_email, private_key } = credentials;

        this.auth = new GoogleAuth({
            credentials: {
                client_email: client_email,
                private_key: private_key.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/drive.file'],
        });

        this.drive = google.drive({
            version: 'v3',
            auth: new google.auth.JWT(
                client_email,
                null,
                private_key,
                ['https://www.googleapis.com/auth/drive.file'],
            ),
        });
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        console.log('Uploading file:', {
            name: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
        });

        if (!file.buffer || file.buffer.length === 0) {
            throw new Error('File is empty');
        }

        try {
            const response = await this.drive.files.create({
                requestBody: {
                    name: file.originalname,
                    mimeType: file.mimetype,
                },
                media: {
                    mimeType: file.mimetype,
                    body: Readable.from(file.buffer) // Usar Readable.from en lugar de buffer directo
                },
            });

            if (!response.data.id) {
                throw new Error('Failed to upload file to Google Drive');
            }

            // Configurar permisos
            await this.drive.permissions.create({
                fileId: response.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            // Verificar que el archivo se subió correctamente
            const uploadedFile = await this.drive.files.get({
                fileId: response.data.id,
                fields: 'id, name, size, mimeType',
            });

            console.log('Uploaded file details:', uploadedFile.data);

            // Retornar URL según el tipo
            if (file.mimetype.startsWith('image/')) {
                return `https://drive.google.com/thumbnail?id=${response.data.id}&sz=w200-h200`;
            } else {
                return `https://drive.google.com/file/d/${response.data.id}/view`;
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('Failed to upload file');
        }
    }

    async deleteFile(fileId: string): Promise<void> {
        await this.drive.files.delete({
            fileId,
        });
    }

    async downloadFile(fileId: string, destinationPath: string): Promise<void> {
        const drive = google.drive({ version: 'v3', auth: this.auth });
        const dest = createWriteStream(destinationPath);

        const response = await drive.files.get({
            fileId: fileId,
            alt: 'media',
        }, { responseType: 'stream' });

        return new Promise((resolve, reject) => {
            response.data
                .on('end', () => {
                    console.log('Done downloading file.');
                    resolve();
                })
                .on('error', err => {
                    console.error('Error downloading file.');
                    reject(err);
                })
                .pipe(dest);
        });
    }
}
