import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from 'src/decorator/public.decorator';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Post('register')
  @Public()
  signUp(@Body() signInDto: SignInDto) {
    return this.authService.signUp(signInDto.username, signInDto.password);
  }
}
