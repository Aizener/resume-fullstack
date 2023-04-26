import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/dto/pagination.dto';

export class SearchTemplateDto extends PaginationDto {
  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    {
      message: '请传入模板类型',
    },
  )
  @IsOptional()
  templateTypeId: number;
}
