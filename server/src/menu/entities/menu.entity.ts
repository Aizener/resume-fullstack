import { Role } from 'src/role/entities/role.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '菜单名称',
    length: 20,
  })
  name: string;

  @Column({
    comment: '菜单路径',
    length: 50,
  })
  path: string;

  @Column({
    comment: '菜单标题',
    length: 50,
  })
  title: string;

  @Column({
    comment: '子菜单ID',
    nullable: true,
  })
  pid: number;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
