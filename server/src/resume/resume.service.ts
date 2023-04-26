import { Fields } from 'src/utils/global.variable';
import {
  ExistFieldInResourceException,
  NotExistResouceException,
} from './../exception/common-exception';
import { ResponseDataType } from './../enum/response-data-type.enum';
import { GenerateResumeDto } from './dto/generate-resume.dto';
import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResumeHelper } from 'src/utils';
import * as qs from 'qs';
import { CommonService } from 'src/common/common.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';
import { Repository } from 'typeorm';
import { PassThrough, Readable } from 'stream';

@Injectable()
export class ResumeService extends CommonService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
  ) {
    super();
  }
  async create(userId: number, createResumeDto: CreateResumeDto) {
    const { templateId } = createResumeDto;
    const resumeEntity: Record<string, any> = {
      ...createResumeDto,
      user: {
        id: userId,
      },
    };
    if (templateId) {
      resumeEntity.template = {
        id: templateId,
      };
    }
    return this.resumeRepository.save(resumeEntity);
  }

  toArrayBuffer(buf: Buffer) {
    const ab = new ArrayBuffer(buf.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; i++) {
      view[i] = buf[i];
    }
    return ab;
  }

  async generatePDF(id: number) {
    const resumeInfo = await this.resumeRepository.findOne({
      where: { id },
      relations: ['template', 'user'],
    });
    if (!resumeInfo) {
      throw NotExistResouceException(Fields.RESUME);
    }
    const { template, ...params } = resumeInfo;
    const tempPath = `http://localhost:5555/public/template/${
      template ? template.name : 'base'
    }/#/`;
    const sh = ResumeHelper.newInstance();
    await sh.initBrowser();
    const pdfData = await sh.shotPDF(
      tempPath,
      qs.stringify({ id, userId: params.user.id }),
    );

    const stream = new PassThrough();
    stream.end(pdfData);

    return {
      data: pdfData,
      type: ResponseDataType.BUFFER,
    };
  }

  async generate(id: number) {
    const resumeInfo = await this.resumeRepository.findOne({
      where: { id },
      relations: ['template', 'user'],
    });
    if (!resumeInfo) {
      throw NotExistResouceException(Fields.RESUME);
    }
    const { template, ...params } = resumeInfo;
    const tempPath = `http://localhost:5555/public/template/${
      template ? template.name : 'base'
    }/#/`;
    const sh = ResumeHelper.newInstance();
    await sh.initBrowser();
    const imgData = await sh.shot(
      tempPath,
      qs.stringify({ id, userId: params.user.id }),
    );
    const pdfData = await sh.savePDF(imgData);
    return { imgData, pdfData };
  }

  findAll() {
    return `This action returns all resume`;
  }

  async findAllByPersonal(userId: number) {
    const [data, total] = await this.resumeRepository.findAndCount({
      where: {
        user: { id: userId },
      },
      relations: ['template'],
    });
    return {
      data,
      total,
      type: ResponseDataType.PAGINATION,
    };
  }

  findOne(id: number) {
    return this.resumeRepository.findOne({
      where: { id },
      relations: ['template'],
    });
  }

  findOneByTemplate(id: number, userId: number) {
    return this.resumeRepository.findOneBy({ id, user: { id: userId } });
  }

  async update(id: number, updateResumeDto: UpdateResumeDto) {
    const { templateId } = updateResumeDto;
    return this.resumeRepository.save({
      ...updateResumeDto,
      id,
      template: {
        id: templateId,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} resume`;
  }

  isExistResumeName(title: string, id?: number) {
    return this.isExistFieldInResouce(
      this.resumeRepository,
      'title',
      title,
      id,
    );
  }
}
