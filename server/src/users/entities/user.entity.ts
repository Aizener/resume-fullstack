import { Resume } from 'src/resume/entities/resume.entity';
import { Role } from 'src/role/entities/role.entity';
import { UserInfo } from 'src/user-info/entities/user-info.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '用户名',
    length: 50,
  })
  username: string;

  @Column({
    comment: '密码',
    length: 100,
  })
  password: string;

  @Column({
    comment: '手机号码',
    length: 100,
    nullable: true,
  })
  phone: string;

  @Column({
    comment: '电子邮箱',
    length: 100,
    nullable: true,
  })
  email: string;

  @CreateDateColumn({
    name: 'created_time',
    comment: '创建时间',
  })
  createdTime: Date;

  @UpdateDateColumn({
    name: 'updated_time',
    comment: '更新时间',
  })
  updatedTime: Date;

  @JoinColumn({
    name: 'user_info_id',
  })
  @OneToOne(() => UserInfo, { cascade: true })
  userInfo: UserInfo;

  @JoinColumn({
    name: 'role_id',
  })
  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => Resume, (resume) => resume.user)
  resume: Resume[];
}
