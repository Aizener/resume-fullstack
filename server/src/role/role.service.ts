import { Length } from 'class-validator';
import { MenuService } from './../menu/menu.service';
import { PermissionService } from './../permission/permission.service';
import { Fields } from 'src/utils/global.variable';
import { ExistFieldInResourceException } from '../exception/common-exception';
import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Repository, Like } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { SearchRoleDto } from './dto/search-role.dto';
import { ResponseDataType } from 'src/enum/response-data-type.enum';

@Injectable()
export class RoleService extends CommonService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly permissionService: PermissionService,
    private readonly menuService: MenuService,
  ) {
    super();
  }
  async create(createRoleDto: CreateRoleDto) {
    const { name, permissions, menus } = createRoleDto;
    if (await this.isExistFieldInResouce(this.roleRepository, 'name', name)) {
      throw ExistFieldInResourceException(Fields.ROLE);
    }
    const roleEntity: Record<string, any> = { ...createRoleDto };
    if (permissions) {
      const permissionEntity = await this.permissionService.findByIds(
        permissions,
      );
      roleEntity.permissions = permissionEntity;
    }
    if (menus) {
      const menuEnitty = await this.menuService.findByIds(menus);
      roleEntity.menus = menuEnitty;
    }

    return this.roleRepository.save(roleEntity);
  }

  findAll() {
    return this.roleRepository.find();
  }

  async findAllByList(@Query() searchRoleDto: SearchRoleDto) {
    const { page, size, name } = searchRoleDto;
    const where: Record<string, any> = {};
    if (name) {
      where.name = Like(`${name}%`);
    }
    const [roles, total] = await this.roleRepository.findAndCount({
      where,
      skip: (page - 1) * size,
      take: size,
      relations: ['menus', 'permissions'],
    });
    return {
      data: roles.map((role) => ({
        ...role,
        permissions: role.permissions.map((p) => p.id),
        menus: role.menus.map((m) => m.id),
        permissionsInfo: role.permissions,
        menusInfo: role.menus,
      })),
      total: total,
      type: ResponseDataType.PAGINATION,
    };
  }

  async findOne(id: number, relations = []) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations,
    });
    return {
      ...role,
      permissions: role.permissions ? role.permissions.map((p) => p.id) : [],
      menus: role.menus ? role.menus.map((m) => m.id) : [],
      permissionsInfo: role.permissions,
      menusInfo: role.menus,
    };
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const { name, permissions, menus } = updateRoleDto;
    if (
      await this.isExistFieldInResouce(this.roleRepository, 'name', name, id)
    ) {
      throw ExistFieldInResourceException(Fields.ROLE);
    }
    const roleEntity: Record<string, any> = { id, ...updateRoleDto };
    if (permissions) {
      const permissionEntity = await this.permissionService.findByIds(
        permissions,
      );
      roleEntity.permissions = permissionEntity;
    }
    if (menus) {
      const menuEnitty = await this.menuService.findByIds(menus);
      roleEntity.menus = menuEnitty;
    }
    return this.roleRepository.save(roleEntity);
  }

  remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
