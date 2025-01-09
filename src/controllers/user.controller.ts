import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { logger } from '../utils/logger';
import { Environment } from '../config/env.config';

export enum StatusCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  // handle user create register
  async createUser(req: Request, res: Response) {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(StatusCode.NOT_FOUND).json({
        success: false,
        message: 'provide all the detail to register',
      });
    }

    try {
      const savedUser = await this.userService.register(req.body);
      return res.status(StatusCode.SUCCESS).json({
        success: true,
        message: 'User created',
        user: savedUser.user.toJSON(),
        token: savedUser.token,
      });
    } catch (error: any) {
      logger.error('Error creating user', error);
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || 'Error creating user',
      });
    }
  }

  // handle user login with their account
  async loginUser(req: Request, res: Response) {
    const userData = req.body;

    if (!userData.email || !userData.password) {
      return res
        .status(StatusCode.NOT_FOUND)
        .json({ success: false, message: 'Email or Password is not provided' });
    }

    try {
      const savedUser = await this.userService.login(
        userData.email,
        userData.password
      );

      res.cookie('token', savedUser.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === Environment.PROD,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });

      return res.status(StatusCode.SUCCESS).json({
        success: true,
        message: 'User logged in success',
        user: savedUser.user.toJSON(),
        token: savedUser.token,
      });
    } catch (error: any) {
      logger.error(error.message);
      return res
        .status(StatusCode.UNAUTHORIZED)
        .json({ success: false, message: error.message});
    }
  }

  // handle user logout
  async logoutUser(req: Request, res: Response) {
    try {
      res.clearCookie('token');
      return res
        .status(StatusCode.SUCCESS)
        .json({ success: true, message: 'User loggedout success' });
    } catch (error) {
      logger.error('Error logging out user');
      return res
        .status(StatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: 'Error logging out' });
    }
  }
}
