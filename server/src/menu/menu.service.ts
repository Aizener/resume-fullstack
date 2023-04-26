import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ExistErrorIdAndPidException,
  ExistFieldInResourceException,
  NotExistResouceException,
} from 'src/exception/common-exception';
import { CommonService } from 'src/common/common.service';
import { Fields } from 'src/utils/global.variable';
import { In, IsNull, Repository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { generateNestArrayToTree } from 'src/utils';

@Injectable()
export class MenuService extends CommonService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {
    super();
  }
  async create(createMenuDto: CreateMenuDto) {
    const { name, pid } = createMenuDto;
    if (await this.isExistNameInMenu(name)) {
      throw ExistFieldInResourceException(Fields.MENU);
    }

    if (pid) {
      const menu = await this.findOne(pid);
      if (!menu) {
        throw NotExistResouceException(Fields.PARENT_MENU);
      }
    }

    return this.menuRepository.save(createMenuDto);
  }

  findAll() {
    return this.menuRepository.find();
  }

  findAllParent() {
    return this.menuRepository.find({
      where: [{ pid: 0 }, { pid: IsNull() }],
    });
  }

  async findTreeAll() {
    const menus = await this.menuRepository.find();
    const menuTree = generateNestArrayToTree(menus);
    return menuTree;
  }

  async findByIds(ids: number[]) {
    return this.menuRepository.findBy({ id: In(ids) });
  }

  async findOne(id: number) {
    return this.menuRepository.findOneBy({ id });
  }

  async update(id: number, UpdateMenuDto: UpdateMenuDto) {
    const { name, pid } = UpdateMenuDto;
    if (id === pid) {
      throw ExistErrorIdAndPidException(Fields.MENU);
    }
    if (await this.isExistNameInMenu(name, id)) {
      throw ExistFieldInResourceException(Fields.MENU);
    }
    return this.menuRepository.save({
      id,
      ...UpdateMenuDto,
    });
  }

  remove(id: number) {
    return this.menuRepository.delete(id);
  }

  async isExistNameInMenu(name: string, id?: number) {
    return this.isExistFieldInResouce(this.menuRepository, 'name', name, id);
  }
}
