import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { ExistFieldInResourceException } from 'src/exception/common-exception';
import { Fields } from 'src/utils/global.variable';
import { Repository } from 'typeorm';
import { CreateTemplateTypeDto } from './dto/create-template-type.dto';
import { UpdateTemplateTypeDto } from './dto/update-template-type.dto';
import { TemplateType } from './entities/template-type.entity';

@Injectable()
export class TemplateTypeService extends CommonService {
  constructor(
    @InjectRepository(TemplateType)
    private readonly templateTypeRepository: Repository<TemplateType>,
  ) {
    super();
  }

  async create(createTemplateTypeDto: CreateTemplateTypeDto) {
    const { name } = createTemplateTypeDto;
    if (await this.isExistName(name)) {
      throw ExistFieldInResourceException(Fields.TEMPLATE_TYPE);
    }
    return this.templateTypeRepository.save(createTemplateTypeDto);
  }

  findAll() {
    return this.templateTypeRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} templateType`;
  }

  async update(id: number, updateTemplateTypeDto: UpdateTemplateTypeDto) {
    const { name } = updateTemplateTypeDto;
    if (await this.isExistName(name, id)) {
      throw ExistFieldInResourceException(Fields.TEMPLATE_TYPE);
    }
    return this.templateTypeRepository.save({
      id,
      ...updateTemplateTypeDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} templateType`;
  }

  isExistName(name: string, id?: number) {
    return this.isExistFieldInResouce(
      this.templateTypeRepository,
      'name',
      name,
      id,
    );
  }
}
