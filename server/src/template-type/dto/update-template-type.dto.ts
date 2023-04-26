import { PartialType } from '@nestjs/mapped-types';
import { CreateTemplateTypeDto } from './create-template-type.dto';

export class UpdateTemplateTypeDto extends PartialType(CreateTemplateTypeDto) {}
