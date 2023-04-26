import {
  ExistFieldInResourceException,
  NotExistResouceException,
} from '../exception/common-exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from 'src/user-info/entities/user-info.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Fields } from 'src/utils/global.variable';
import { CommonService } from 'src/common/common.service';
import { RoleService } from 'src/role/role.service';
import { generateNestArrayToTree, genHash } from 'src/utils';
import { ResponseDataType } from 'src/enum/response-data-type.enum';
import { SearchUserDto } from './dto/search-user.dto';
import { PermissionService } from 'src/permission/permission.service';
import { MenuService } from 'src/menu/menu.service';

@Injectable()
export class UsersService extends CommonService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
    private readonly menuService: MenuService,
  ) {
    super();
  }
  async create(createUserDto: CreateUserDto) {
    const { username, password, phone, email, role, ...userInfo } =
      createUserDto;
    if (await this.isExistUsername(username)) {
      throw ExistFieldInResourceException(Fields.USERNAME);
    }

    const user: Record<string, any> = {
      username,
      password: await genHash(password),
      phone,
      email,
      userInfo,
    };

    if (role) {
      user.role = role;
    }

    const userEntity = this.userRepository.create(user);

    return this.userRepository.save(userEntity);
  }

  async findAll(condition: SearchUserDto) {
    const { page, size = 10, username } = condition;
    const where: Record<string, any> = {};
    if (username) {
      where.username = Like(`${username}%`);
    }
    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip: (page - 1) * size,
      take: size,
      relations: ['userInfo', 'role'],
    });
    const data = users.map((user) => {
      const { userInfo, role, ...fileds } = user;
      return {
        ...fileds,
        ...userInfo,
        id: fileds.id,
        role: role ? role.id : 0,
        roleInfo: role,
      };
    });
    return {
      data,
      total,
      type: ResponseDataType.PAGINATION,
    };
  }

  async findOne(id: number, relations = []) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations,
    });
    if (!user) {
      throw NotExistResouceException(Fields.USER);
    }

    const { userInfo, role, ...fileds } = user;
    return {
      ...fileds,
      ...userInfo,
      id: fileds.id,
      role: role ? role.id : 0,
      roleInfo: role,
    };
  }

  async findOneByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['role'],
    });
    if (!user) {
      return;
    }
    return user;
  }

  async findUserAbilityById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) {
      throw NotExistResouceException(Fields.USER);
    }
    const menus = await this.findUserMenuById(user.id, user);
    const permissions = await this.findUserPermissionById(user.id, user);

    return {
      menus,
      permissions,
    };
  }

  async findUserMenuById(id: number, _user?: User) {
    let user: User;
    if (_user) {
      user = _user;
    } else {
      user = await this.userRepository.findOne({
        where: { id },
        relations: ['role'],
      });
    }
    const { role } = user;
    if (!role) {
      return [];
    }

    const { menusInfo } = await this.roleService.findOne(role.id, ['menus']);
    const allMenuParents = await this.menuService.findAllParent();

    const menuTree = generateNestArrayToTree(menusInfo, allMenuParents);
    return menuTree;
  }

  async findUserPermissionById(id: number, _user?: User) {
    let user: User;
    if (_user) {
      user = _user;
    } else {
      user = await this.userRepository.findOne({
        where: { id },
        relations: ['role'],
      });
    }
    const { role } = user;
    if (!role) {
      return [];
    }

    const { permissionsInfo } = await this.roleService.findOne(role.id, [
      'permissions',
    ]);
    const permissionTree = generateNestArrayToTree(permissionsInfo);
    return permissionTree;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { username, password, phone, email, role, ...userInfo } =
      updateUserDto;
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userInfo'],
    });
    if (!user) {
      throw NotExistResouceException(Fields.USERNAME);
    }
    if (username && (await this.isExistUsername(username, user.id))) {
      throw ExistFieldInResourceException(Fields.USERNAME);
    }
    const updateUserInfo: Record<string, any> = { ...userInfo };
    if (user.userInfo) {
      updateUserInfo.id = user.userInfo.id;
    }
    const userEntity: Record<string, any> = {
      id,
      username,
      phone,
      email,
      userInfo: updateUserInfo,
    };
    if (password) {
      userEntity.password = await genHash(password);
    }
    if (role) {
      userEntity.role = role;
    }
    return this.userRepository.save(userEntity);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw NotExistResouceException(Fields.USER);
    }
    return this.userRepository.delete(id);
  }

  async isExistUsername(username: string, id?: number) {
    const isExist = await this.isExistFieldInResouce(
      this.userRepository,
      'username',
      username,
      id,
    );
    return isExist;
  }
}
