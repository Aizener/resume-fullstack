import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  Query,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { GenerateResumeDto } from './dto/generate-resume.dto';
import { Public } from 'src/decorator/public.decorator';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  create(@Req() request, @Body() createResumeDto: CreateResumeDto) {
    const userId = request.user.id;
    return this.resumeService.create(userId, createResumeDto);
  }

  @Post('/generate/:id')
  async generate(@Param('id') id: number) {
    return await this.resumeService.generate(id);
  }

  @Post('/generate/pdf/:id')
  async generatePDF(@Param('id') id: number) {
    return this.resumeService.generatePDF(id);
  }

  @Get()
  findAll() {
    return this.resumeService.findAll();
  }

  @Get('/personal')
  findAllByPersonal(@Req() request) {
    const userId = request.user.id;
    return this.resumeService.findAllByPersonal(userId);
  }

  @Public()
  @Get('/get')
  findOneByTemplate(@Query('id') id: string, @Query('userId') userId: string) {
    return this.resumeService.findOneByTemplate(+id, +userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto) {
    return this.resumeService.update(+id, updateResumeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resumeService.remove(+id);
  }
}
