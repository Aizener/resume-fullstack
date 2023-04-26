import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { QiniuService } from './qiniu.service';
import { QiniuController } from './qiniu.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [QiniuController],
  providers: [QiniuService],
})
export class QiniuModule {}
