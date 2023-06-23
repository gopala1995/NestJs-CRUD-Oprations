import { IsOptional, IsString, IsEnum, IsNumber,IsEmpty } from 'class-validator';
import { Category } from '../schemas/book.schema';
import { User } from '../../auth/schemas/user.schema';

export class updateBookDto {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly author: string;

  @IsOptional()
  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsEnum(Category, { message: 'Please enter valid category!' })
  readonly category: Category;

  @IsEmpty({message:'You can Not pass useId'})
  readonly user :User
}
