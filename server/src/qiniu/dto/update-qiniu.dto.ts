import { PartialType } from '@nestjs/mapped-types';
import { CreateQiniuDto } from './create-qiniu.dto';

export class UpdateQiniuDto extends PartialType(CreateQiniuDto) {}
