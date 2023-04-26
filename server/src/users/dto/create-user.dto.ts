import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { CreateUserInfoDto } from 'src/user-info/dto/create-user-info.dto';

export class CreateUserDto extends PartialType(CreateUserInfoDto) {
  @IsString()
  @Length(6, 20, {
    message: '用户名必须为6到20位之间的字符串',
  })
  username: string;

  @IsString()
  password: string;

  @IsString()
  @IsPhoneNumber(undefined, {
    message: '字段phone必须为合格的手机号码格式',
  })
  @IsOptional()
  phone?: string;

  @IsString()
  @IsEmail(undefined, {
    message: '字段email必须为合格的电子邮箱格式',
  })
  @IsOptional()
  email?: string;

  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    {
      message: '请传正确的角色ID',
    },
  )
  @IsPositive()
  @IsOptional()
  role?: number;
}
