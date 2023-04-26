import { IsOptional, IsString } from 'class-validator';

export class GenerateResumeDto {
  @IsString()
  path: string;

  @IsString()
  @IsOptional()
  name?: string;
}
