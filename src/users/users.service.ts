/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from 'src/auth/dto/loginDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>, //1
  ) {}

  //Part for sign up authentication
  // Create a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(); //2
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt); //3

    // Create a new user entity from the DTO
    const newUser = await this.userRepository.save(createUserDto); //4
    delete newUser.password; //5
    return newUser; //6
    // return await this.userRepository.save(newUser);
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
