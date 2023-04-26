import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { QiniuService } from './qiniu.service';
import { CreateQiniuDto } from './dto/create-qiniu.dto';
import { UpdateQiniuDto } from './dto/update-qiniu.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from 'src/pipes/file-size-validation.pipe';
import { Public } from 'src/decorator/public.decorator';

@Public()
@Controller('qiniu')
export class QiniuController {
  constructor(private readonly qiniuService: QiniuService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Body('uploadToken') uploadToken,
    @UploadedFile(new FileSizeValidationPipe()) file: Express.Multer.File,
  ) {
    if (!uploadToken) {
      throw new BadRequestException('请传入uploadToken字段');
    }
    return this.qiniuService.uploadFile(uploadToken, file);
  }

  @Get('/token')
  getToken() {
    return this.qiniuService.createToken();
  }

  @Post()
  create(@Body() createQiniuDto: CreateQiniuDto) {
    return this.qiniuService.create(createQiniuDto);
  }

  @Get()
  findAll() {
    return this.qiniuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qiniuService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQiniuDto: UpdateQiniuDto) {
    return this.qiniuService.update(+id, updateQiniuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qiniuService.remove(+id);
  }
}
