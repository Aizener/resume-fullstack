import { Role } from 'src/role/entities/role.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '权限名称',
    length: 20,
  })
  name: string;

  @Column({
    comment: '权限方法',
    length: 50,
    nullable: true,
  })
  method: string;

  @Column({
    comment: '权限标题',
    length: 50,
    nullable: true,
  })
  title: string;

  @Column({
    comment: '子权限ID',
    nullable: true,
  })
  pid: number;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
