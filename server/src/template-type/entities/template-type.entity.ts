import { Template } from './../../template/entities/template.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TemplateType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '简历分类名称',
  })
  name: string;

  @OneToMany(() => Template, (template) => template.templateType)
  templates: Template;
}
