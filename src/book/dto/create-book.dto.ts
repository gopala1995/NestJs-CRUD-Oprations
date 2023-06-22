import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { Category } from '../schemas/book.schema';

export class createBookDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly author: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please enter valid category!' })
  readonly category: Category;
}
