import jwt from 'jsonwebtoken';
import { UserRepository } from '../repository/user.repository';
import { IUser, User } from '../models/user.model';
import { config } from '../config/env.config';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

    async register(
    userData: Partial<IUser>
  ): Promise<{ user: User; token: string }> {
    // validate input
    if (!userData.email || !userData.password) {
      throw new Error('Email and Password are Required');
    }

    // TODO: Perform extra validation

    // checking if the user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // hash the password
    const hashedPassword = userData.password;

    // create the user
    const user = await this.userRepository.createUser({
      ...userData,
      password: hashedPassword,
    });

    // generate token
    const token = this.generateToken(user);

    return { user, token };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    // check to see the user is there or not
    const user = await this.userRepository.findByEmail(email);

    // if not user throw error
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // check if the password is valid or not
    const isPasswordCorrect = password === user.password;

    if (!isPasswordCorrect) {
      throw new Error('Password Incorrect please provide correct password');
    }

    // generate jwt
    const token = this.generateToken(user);

    return { user, token };
  }

  async updateUser(id: number, updateData: Partial<IUser>): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // If updating password, hash it
    if (updateData.password) {
      //TODO:   updateData.password = await bcrypt.hash(updateData.password, 10);
      updateData.password = updateData.password;
    }

    // Update user
    const updatedUser = await this.userRepository.update(id, updateData);
    return updatedUser;
  }

  private generateToken(user: User): string {
    if (!config.jwt.secret) {
      throw new Error('JWT secret is not defined');
    }
    return jwt.sign({ id: user.id, email: user.email }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }
}
