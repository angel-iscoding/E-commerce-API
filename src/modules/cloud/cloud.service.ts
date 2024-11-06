import { Injectable } from '@nestjs/common';
import { cloudinary } from '../../config/cloudnary.config';

@Injectable()
export class CloudService {
  /**
   * Sube una imagen a la nube
   * @param file Archivo de imagen a subir
   * @returns URL de la imagen subida
   */
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      ).end(file.buffer);
    });
  }
}
