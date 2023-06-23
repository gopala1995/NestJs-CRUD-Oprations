import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/signUp.dto';
import { LogInDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: signUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Get('/login')
  logIn(@Body() logInDto: LogInDto): Promise<{ token: string }> {
    return this.authService.login(logInDto);
  }
}
