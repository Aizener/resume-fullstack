import { RolesGuard } from 'src/guard/roles.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { Role } from 'src/decorator/roles.decorator';
import { RoleType } from 'src/enum/roles.enum';
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/enum/action.enum';
import { PoliciesGuard } from 'src/guard/policies.guard';
import { Policies } from 'src/decorator/policies.decorator';
import { User } from './entities/user.entity';
import { UserPolicyHandler } from 'src/handler/user-policy.handler';
import { Public } from 'src/decorator/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() condition: PaginationDto) {
    return this.usersService.findAll(condition);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id, ['userInfo', 'role']);
  }

  @Get('/menu/:id')
  findUserMenu(@Param('id') id: string) {
    return this.usersService.findUserMenuById(+id);
  }

  @Get('/permission/:id')
  findUserPermission(@Param('id') id: string) {
    return this.usersService.findUserPermissionById(+id);
  }

  @Get('/ability/:id')
  findUserAbilityById(@Param('id') id: string) {
    return this.usersService.findUserAbilityById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Policies(new UserPolicyHandler(Action.DELETE))
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
