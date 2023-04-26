import { Injectable } from '@nestjs/common';
import { CreateQiniuDto } from './dto/create-qiniu.dto';
import { UpdateQiniuDto } from './dto/update-qiniu.dto';
import * as qiniu from 'qiniu';
import { PassThrough } from 'stream';

@Injectable()
export class QiniuService {
  createToken() {
    const accessKey = process.env.AccessKey;
    const secretKey = process.env.SecretKey;
    const bucket = process.env.QiniuBucket;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: bucket,
      returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize)}',
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    return uploadToken;
  }

  async uploadFile(uploadToken: string, file: Express.Multer.File) {
    const putExtra = new qiniu.form_up.PutExtra();
    const key = Date.now() + '_' + Math.round(Math.random() * 1000);
    const bufferStrean = new PassThrough();
    const _stream = bufferStrean.end(file.buffer);
    return await this.putFile(uploadToken, key, _stream, putExtra);
  }

  putFile(uploadToken, key, localFile, putExtra) {
    const config: any = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z2;
    const formUploader = new qiniu.form_up.FormUploader(config);
    return new Promise((resolve, reject) => {
      formUploader.putStream(
        uploadToken,
        key,
        localFile,
        putExtra,
        function (respErr, respBody, respInfo) {
          if (respErr) {
            reject(respErr);
          }
          resolve(respBody);
        },
      );
    });
  }

  create(createQiniuDto: CreateQiniuDto) {
    return 'This action adds a new qiniu';
  }

  findAll() {
    return `This action returns all qiniu`;
  }

  findOne(id: number) {
    return `This action returns a #${id} qiniu`;
  }

  update(id: number, updateQiniuDto: UpdateQiniuDto) {
    return `This action updates a #${id} qiniu`;
  }

  remove(id: number) {
    return `This action removes a #${id} qiniu`;
  }
}
