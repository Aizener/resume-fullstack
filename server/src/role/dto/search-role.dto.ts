import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/dto/pagination.dto';

export class SearchRoleDto extends PartialType(PaginationDto) {
  @IsString({
    message: '请输入角色名称',
  })
  @IsOptional()
  name?: string;
}
