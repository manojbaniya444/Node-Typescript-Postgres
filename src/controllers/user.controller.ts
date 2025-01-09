import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(req: Request, res: Response) {
    const user = new User(req.body);

    // TODO: validate

    const savedUser = await this.userService.register(user);
    res.status(200).json({
      success: true,
      message: 'User register done',
      user: savedUser.user.toJSON(),
      token: savedUser.token,
    });
  }

  async loginUser(req: Request, res: Response) {
    const userData = new User(req.body);

    const { user, token } = await this.userService.login(
      userData.email,
      userData.password
    );

    res.status(200).json({
      success: true,
      message: 'User Login done',
      user: user.toJSON(),
      token,
    });
  }
}
