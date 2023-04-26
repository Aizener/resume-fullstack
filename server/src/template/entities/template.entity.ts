import { Resume } from 'src/resume/entities/resume.entity';
import { TemplateType } from 'src/template-type/entities/template-type.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '简历路径名',
  })
  name: string;

  @Column({
    comment: '简历名称',
  })
  title: string;

  @Column({
    comment: '封面图',
    nullable: true,
  })
  cover: string;

  @Column({
    comment: '简历描述',
    nullable: true,
  })
  desc: string;

  @Column({
    comment: '简历价格',
    default: 0,
  })
  price: 0;

  @Column({
    comment: '模板下载次数',
    default: 0,
  })
  downloadNum: number;

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
    name: 'template_type_id',
  })
  @ManyToOne(() => TemplateType, (templateType) => templateType.templates)
  templateType: TemplateType;

  @OneToMany(() => Resume, (resume) => resume.template)
  resume: Resume[];
}
