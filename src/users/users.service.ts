/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from 'src/auth/Dto/loginDto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>, //1
  ) {}

  //The create User method
  //Part for sign up authentication
  // Create a new user
  //Part for hashing password
  async create(createUserDto: CreateUserDto): Promise<User> {
    let existingUser = undefined;

    // Check if user already exists in the database
    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('A user with this email already exists.');
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; // Rethrow conflict error
      }
      // Handle database connection issues or other unexpected errors
      throw new RequestTimeoutException(
        'Unable to process this request, please try again later.',
        {
          description: 'Error connecting to the database',
          cause: 'Database might be unreachable or under heavy load.',
        },
      );
    }

    try {
      // Hash password and generate API key
      const salt = await bcrypt.genSalt();
      createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
      createUserDto.apiKey = uuidv4();

      // Create a new user entity from the DTO
      const newUser = await this.userRepository.save(createUserDto);
      delete newUser.password; // Ensure password is not returned
      return newUser; // Return the created user
    } catch (error) {
      // Handle potential errors during user creation
      if (error.code === '23505') {
        // Handle unique constraint violation (if using PostgreSQL)
        throw new ConflictException('A user with this email already exists.');
      }

      throw new InternalServerErrorException(
        'An error occurred while creating the user. Please try again later.',
        {
          description: 'Error during user creation in the database.',
          cause: error.message,
        },
      );
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  // Fetch user by ID
  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id: id });
  }

  // Fetch user by email for authentication
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async findOne(data: LoginDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }
    return user;
  }

  async updateSecretKey(userId, secret: string): Promise<UpdateResult> {
    return this.userRepository.update(
      {
        id: userId,
      },
      { twoFAsecret: secret, enable2FA: true },
    );
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        enable2FA: false,
        twoFAsecret: null,
      },
    );
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByApiKey(apiKey: string): Promise<User> {
    return await this.userRepository.findOneBy({ apiKey });
  }

  public async deleteUser(id: number) {
    // throw new HttpException(
    //   {
    //     status: HttpStatus.TEMPORARY_REDIRECT,
    //     error: `error:You are being temporarilty redirected`,
    //   },
    //   HttpStatus.TEMPORARY_REDIRECT
    // );
    const user = await this.userRepository.findOne({ where: { id } });

    // If the user does not exist, throw an exception
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Delete the user from the database
    await this.userRepository.remove(user);
    return `User with id ${id} has been successfully deleted`;
  }
}
