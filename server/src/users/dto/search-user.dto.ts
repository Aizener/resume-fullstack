import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { PaginationDto } from 'src/dto/pagination.dto';

export class SearchUserDto extends PartialType(PaginationDto) {
  @IsString()
  username?: string;
}
