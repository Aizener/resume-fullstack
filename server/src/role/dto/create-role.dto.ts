import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @Length(2, 20, {
    message: '请输入2到20位的字符串',
  })
  name: string;

  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    { each: true },
  )
  @IsOptional()
  permissions?: number[];

  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    { each: true },
  )
  @IsOptional()
  menus?: number[];
}
