import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TemplateTypeService } from './template-type.service';
import { TemplateTypeController } from './template-type.controller';
import { TemplateType } from './entities/template-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateType])],
  controllers: [TemplateTypeController],
  providers: [TemplateTypeService],
})
export class TemplateTypeModule {}
