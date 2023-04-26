import { IsString } from 'class-validator';

export class SignInDto {
  @IsString({
    message: '请传入用户名',
  })
  username: string;
  @IsString({
    message: '请传入密码',
  })
  password: string;
}
