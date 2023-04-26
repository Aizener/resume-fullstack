import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const maxSize = 2 * 1024 * 1024;
    if (value.size > maxSize) {
      throw new BadRequestException('传入的文件超过了1MB大小');
    }
    return value;
  }
}
