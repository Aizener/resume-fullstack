import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { UserInfoModule } from './user-info/user-info.module';
import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { MenuModule } from './menu/menu.module';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { ResumeModule } from './resume/resume.module';
import { TemplateModule } from './template/template.module';
import { TemplateTypeModule } from './template-type/template-type.module';
import { QiniuModule } from './qiniu/qiniu.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST,
      port: ~~process.env.PORT,
      username: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    UsersModule,
    UserInfoModule,
    CommonModule,
    RoleModule,
    PermissionModule,
    MenuModule,
    AuthModule,
    CaslModule,
    ResumeModule,
    TemplateModule,
    TemplateTypeModule,
    QiniuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
