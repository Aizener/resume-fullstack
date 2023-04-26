import {
  groupArrayToObjectBy,
  generateNestArrayToTree,
} from './../utils/index';
import { ExistFieldInResourceException } from '../exception/common-exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { In, Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { Fields } from 'src/utils/global.variable';

@Injectable()
export class PermissionService extends CommonService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    super();
  }
  async create(createPermissionDto: CreatePermissionDto) {
    const { name } = createPermissionDto;
    if (await this.isExistNameInPermission(name)) {
      throw ExistFieldInResourceException(Fields.PERMISSION);
    }

    return this.permissionRepository.save(createPermissionDto);
  }

  findAll() {
    return this.permissionRepository.find();
  }

  findAllParent() {
    return this.permissionRepository.find({
      where: [{ pid: 0 }, { pid: null }],
    });
  }

  async findGroupAll() {
    const permissions = await this.permissionRepository.find();
    const permissionGroup = generateNestArrayToTree(permissions);
    return permissionGroup;
  }
  async findByIds(ids: number[]) {
    return this.permissionRepository.findBy({ id: In(ids) });
  }

  async findOne(id: number) {
    return this.permissionRepository.findOneBy({ id });
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const { name } = updatePermissionDto;
    if (await this.isExistNameInPermission(name, id)) {
      throw ExistFieldInResourceException(Fields.PERMISSION);
    }
    return this.permissionRepository.save({
      id,
      ...updatePermissionDto,
    });
  }

  remove(id: number) {
    return this.permissionRepository.delete(id);
  }

  async isExistNameInPermission(name: string, id?: number) {
    return this.isExistFieldInResouce(
      this.permissionRepository,
      'name',
      name,
      id,
    );
  }
}
