import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getModelToken } from '@nestjs/mongoose';
import { Book } from './schemas/book.schema';
import mongoose, { Model } from 'mongoose';
import {
  BadRequestException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { isArrayBufferView } from 'util/types';
import { createBookDto } from './dto/create-book.dto';
import { User } from '../auth/schemas/user.schema';

describe('BookService', () => {
  let bookService: BookService;
  let model: Model<Book>;

  const mockBook = {
    _id: '64a509fdbbae107a288071ce',
    user: '64a509fdbbae107a288071ce',
    title: 'Book 1',
    description: 'Book description',
    author: 'Book author 1',
    price: 399,
    category: 'Category.FANTASY',
  };

  const mockUser = {
    _id: '64a509fdbbae107a288071ce',
    name: 'Gopala',
    email: 'g@gmail.com',
  };
  const mockBookservice = {
    find: jest.fn(),
    create:jest.fn(),
    findById: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookservice,
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    model = module.get<Model<Book>>(getModelToken(Book.name));
  });

  describe('findAll', () => {
    it('should return array of book', async () => {
      const query = { page: '1', keywords: 'test' };

      jest.spyOn(model, 'find').mockImplementation(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockBook]),
            }),
          } as any),
      );

      const result = await bookService.findAll(query);

      // expect(model.find).toHaveBeenCalledWith({
      //   title: {  $regex: 'test', $options: 'i' }
      // });

      expect(result).toEqual([mockBook]);
    });
  });

  describe('create', () => {
    it('should create and return a book', async () => {
      const newMockBook = {
        title: 'Book 2',
        description: 'Book description',
        author: 'Book author 2',
        price: 399,
        category: 'Category.FANTASY',
      };

      // jest
      //   .spyOn(model,'create')
      //   .mockImplementationOnce(()=> Promise.resolve(mockBook));

      const result = await bookService.create(
        newMockBook as createBookDto,
        mockUser as User,
      );

      expect(result).toEqual(mockBook)
    });
  });
  describe('findById', () => {
    it('should return the book id ', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockBook);
      const result = await bookService.findById(mockBook._id);

      expect(model.findById).toHaveBeenCalledWith(mockBook._id);

      expect(result).toEqual(mockBook);
    });

    it('should return BadRequestException if invalid Id provide ', async () => {
      const id = 'invalid-id';

      const isValidObjectIdMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(bookService.findById(id)).rejects.toThrow(
        BadRequestException,
      );

      expect(isValidObjectIdMock).toHaveBeenLastCalledWith(id);
      isValidObjectIdMock.mockRestore();
    });

    it('should return notFoundException if book is not found ', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(bookService.findById(mockBook._id)).rejects.toThrow(
        NotAcceptableException,
      );

      expect(model.findById).toHaveBeenCalledWith(mockBook._id);
    });
  });
});
