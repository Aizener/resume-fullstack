import { Template } from 'src/template/entities/template.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Resume {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '简历名称',
    length: 20,
  })
  title: string;

  @Column({
    comment: '头像',
    length: 100,
    nullable: true,
  })
  avatar: string;

  @Column({
    comment: '姓名',
    length: 20,
    nullable: true,
  })
  name: string;

  @Column({
    comment: '年龄',
    nullable: true,
  })
  age: number;

  @Column({
    comment: '性别：1-男，0-女',
    nullable: true,
  })
  sex: number;

  @Column({
    comment: '电话',
    nullable: true,
  })
  phone: string;

  @Column({
    comment: '邮箱',
    nullable: true,
  })
  email: string;

  @Column({
    comment: '求职岗位',
    nullable: true,
  })
  job: string;

  @Column({
    name: 'work_age',
    comment: '工作年限',
    nullable: true,
  })
  workAge: number;

  @Column({
    comment: '当前状态',
    nullable: true,
  })
  status: number;

  @Column({
    type: 'text',
    comment: '个人优势',
    nullable: true,
  })
  advantage: string;

  @Column({
    name: 'work_list',
    type: 'text',
    comment: '工作经历',
    nullable: true,
  })
  workList: string;

  @Column({
    name: 'project_list',
    type: 'text',
    comment: '项目经历',
    nullable: true,
  })
  projectList: string;

  @Column({
    name: 'education_list',
    type: 'text',
    comment: '教育经历',
    nullable: true,
  })
  educationList: string;

  @Column({
    comment: '个人爱好',
    nullable: true,
  })
  likes: string;

  @Column({
    comment: '个人链接',
    nullable: true,
  })
  links: string;

  @Column({
    comment: '排序',
    nullable: true,
  })
  sort: string;

  @JoinColumn({
    name: 'user_id',
  })
  @ManyToOne(() => User, (user) => user.resume)
  user: User;

  @JoinColumn({
    name: 'template_id',
  })
  @ManyToOne(() => Template, (template) => template.resume)
  template: Template;
}
