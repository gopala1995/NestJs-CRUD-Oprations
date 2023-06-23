import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { signUpDto } from './dto/signUp.dto';
import { LogInDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto:signUpDto): Promise<{ token: string }> {
    const { name, email, password } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(logInDto:LogInDto): Promise<{ token: string }>{
    const {  email, password } = logInDto;

    const user = await this.userModel.findOne({email})

    if(!user){
      throw new UnauthorizedException('Invalid email or password')
    }

    const isPasswordMached = await bcrypt.compare(password, user.password)

    if(!isPasswordMached){
      throw new UnauthorizedException('Invalid email or password')
    }
   
    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }
}
