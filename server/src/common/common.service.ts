import { Not, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import * as qiniu from 'qiniu';

@Injectable()
export class CommonService {
  /**
   * 判断字段是否存在于资源当中
   * @param repository 对应的数据实体存储器
   * @param field 字段名称，例如：username
   * @param fieldValue 字段值：例如：admin
   * @param id 需要排除的对应id的字段
   * @returns 返回boolean值
   */
  async isExistFieldInResouce<T>(
    repository: Repository<T>,
    field: string,
    fieldValue: string,
    id?: number,
  ) {
    const conditions: Record<string, any> = { [field]: fieldValue };
    if (id) {
      conditions.id = Not(id);
    }
    const resource = await repository.findOneBy(conditions);
    return !!resource;
  }
}
