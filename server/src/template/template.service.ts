import { NotExistResouceException } from './../exception/common-exception';
import { SearchTemplateDto } from './dto/search-template.dto';
import { ExistFieldInResourceException } from 'src/exception/common-exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { DataSource, Repository } from 'typeorm';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Template } from './entities/template.entity';
import { Fields } from 'src/utils/global.variable';
import { ResponseDataType } from 'src/enum/response-data-type.enum';

@Injectable()
export class TemplateService extends CommonService {
  constructor(
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }
  async create(createTemplateDto: CreateTemplateDto) {
    const { name, title } = createTemplateDto;
    if ((await this.isExistName(name)) || (await this.isExistName(title))) {
      throw ExistFieldInResourceException(Fields.TEMPLATE);
    }
    const templateTypeEntity = { id: createTemplateDto.templateId };
    return this.templateRepository.save({
      ...createTemplateDto,
      templateTypeEntity,
    });
  }

  async findAll(searchTemplateDto: SearchTemplateDto) {
    const { page, size, templateTypeId } = searchTemplateDto;
    const [data, total] = await this.templateRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      where: {
        templateType: { id: templateTypeId },
      },
    });
    return {
      data,
      total,
      type: ResponseDataType.PAGINATION,
    };
  }

  getDefaultTemplate() {
    return this.templateRepository.findOneBy({ name: 'base' });
  }

  findOne(id: number) {
    return `This action returns a #${id} template`;
  }

  async update(id: number, updateTemplateDto: UpdateTemplateDto) {
    const { name, title } = updateTemplateDto;
    if (
      (await this.isExistName(name, id)) ||
      (await this.isExistName(title, id))
    ) {
      throw ExistFieldInResourceException(Fields.TEMPLATE);
    }
    const templateTypeEntity = { id: updateTemplateDto.templateId };
    return this.templateRepository.save({
      id,
      ...updateTemplateDto,
      templateTypeEntity,
    });
  }

  async download(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const template = await queryRunner.manager.findOne(Template, {
        where: { id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!template) {
        throw NotExistResouceException(Fields.TEMPLATE);
      }
      template.downloadNum++;
      await queryRunner.manager.save(template);
      await queryRunner.commitTransaction();
      return template;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} template`;
  }

  isExistName(name: string, id?: number) {
    return this.isExistFieldInResouce(
      this.templateRepository,
      'name',
      name,
      id,
    );
  }
}
