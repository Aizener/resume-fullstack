import { IsString } from 'class-validator';

export class CreateTemplateTypeDto {
  @IsString({
    message: '请输入模板名称',
  })
  name: string;
}
