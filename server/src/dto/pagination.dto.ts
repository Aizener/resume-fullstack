import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    {
      message: '请传入分页page参数',
    },
  )
  @IsPositive({
    message: '分页page参数必须为大于0的整数',
  })
  page: number;

  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    {
      message: '请传入分页size参数',
    },
  )
  @IsPositive({
    message: '分页size参数必须为大于0的整数',
  })
  @IsOptional()
  size?: number;
}
