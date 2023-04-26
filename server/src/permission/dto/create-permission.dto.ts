import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsString({
    message: '请输入权限名称',
  })
  name: string;

  @IsString({
    message: '请输入权限路径',
  })
  path: string;

  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    {
      message: '请输入正确的PID',
    },
  )
  @IsPositive({
    message: '请输入整数PID',
  })
  @IsOptional()
  pid?: number;
}
