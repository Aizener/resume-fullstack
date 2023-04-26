import { compareHash } from './../utils/index';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, _password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new UnauthorizedException('不存在该用户');
    }
    const isValid = await compareHash(_password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('用户密码错误');
    }
    const { password, ...otherInfo } = user;
    const token = await this.jwtService.signAsync(otherInfo);
    return {
      ...otherInfo,
      accessToken: token,
    };
  }

  async signUp(username: string, _password: string) {
    const user = await this.usersService.create({
      username,
      password: _password,
    });
    const { password, ...otherInfo } = user;
    const token = await this.jwtService.signAsync(otherInfo);
    return {
      ...otherInfo,
      accessToken: token,
    };
  }
}
