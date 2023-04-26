import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { OneToOne } from 'typeorm';

export class CreateUserInfoDto {
  @IsString({
    message: '请传正确的用户昵称',
  })
  @IsOptional()
  nickname: string;

  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    {
      message: '请传合法的年龄',
    },
  )
  @IsOptional()
  age: number;

  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    {
      message: '请传合法的性别',
    },
  )
  @IsOptional()
  sex: number;

  @OneToOne(() => User)
  user: User;
}
