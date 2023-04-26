import { Menu } from 'src/menu/entities/menu.entity';
import { Permission } from 'src/permission/entities/permission.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '角色名',
  })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @JoinTable()
  @ManyToMany(() => Permission, (permission) => permission.roles)
  permissions: Permission[];

  @JoinTable()
  @ManyToMany(() => Menu, (menu) => menu.roles)
  menus: Menu[];
}
