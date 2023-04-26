import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TemplateTypeService } from './template-type.service';
import { CreateTemplateTypeDto } from './dto/create-template-type.dto';
import { UpdateTemplateTypeDto } from './dto/update-template-type.dto';
import { Public } from 'src/decorator/public.decorator';

@Public()
@Controller('template-type')
export class TemplateTypeController {
  constructor(private readonly templateTypeService: TemplateTypeService) {}

  @Post()
  create(@Body() createTemplateTypeDto: CreateTemplateTypeDto) {
    return this.templateTypeService.create(createTemplateTypeDto);
  }

  @Get()
  findAll() {
    return this.templateTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.templateTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTemplateTypeDto: UpdateTemplateTypeDto,
  ) {
    return this.templateTypeService.update(+id, updateTemplateTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.templateTypeService.remove(+id);
  }
}
