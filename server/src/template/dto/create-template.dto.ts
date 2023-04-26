import { IsNumber, IsString } from 'class-validator';

export class CreateTemplateDto {
  @IsString({
    message: '请传入模板路径名称',
  })
  name: string;

  @IsString({
    message: '请传入简历名称',
  })
  title: string;

  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    {
      message: '请传入模板类型',
    },
  )
  templateId: number;
}
