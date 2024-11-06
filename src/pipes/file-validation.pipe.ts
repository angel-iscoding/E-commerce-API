import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    const oneKb = 1000;
    const fileSize = value.size / oneKb;

    if (fileSize > 200) {
      throw new BadRequestException('El tamaño del archivo no debe ser mayor a 200kb');
    }

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(value.mimetype)) {
      throw new BadRequestException('Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG y GIF');
    }

    return value;
  }
}
