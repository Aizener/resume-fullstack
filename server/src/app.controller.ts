import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { genHash, compareHash } from './utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return await genHash('admin');
  }

  @Get('match')
  async match(@Query('password') password, @Query('hash') hash) {
    return await compareHash(password, hash);
  }
}
