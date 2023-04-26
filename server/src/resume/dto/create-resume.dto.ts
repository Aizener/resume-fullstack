import {
  IsOptional,
  IsString,
  IsNumber,
  isNumber,
  Length,
} from 'class-validator';

export class CreateResumeDto {
  @IsString({
    message: '请传入简历名称',
  })
  title: string;

  @IsNumber(
    {
      maxDecimalPlaces: 0,
    },
    {
      message: '请传入模板ID',
    },
  )
  @IsOptional()
  templateId: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  avatar: string;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsNumber()
  @IsOptional()
  sex: number;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  job: string;

  @IsNumber()
  @IsOptional()
  workAge: number;

  @IsNumber()
  @IsOptional()
  status: number;

  @IsString()
  @IsOptional()
  advantage: string;

  @IsString()
  @IsOptional()
  workList: string;

  @IsString()
  @IsOptional()
  projectList: string;

  @IsString()
  @IsOptional()
  educationList: string;

  @IsString()
  @IsOptional()
  likes: string;

  @IsString({ each: true })
  @IsOptional()
  links: string;

  @IsNumber()
  @IsOptional()
  userId: number;
}
