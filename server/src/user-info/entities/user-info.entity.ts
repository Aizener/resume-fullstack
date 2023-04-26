import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '昵称',
    nullable: true,
  })
  nickname: string;

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
}
