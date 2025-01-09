import express from 'express';
import { UserController } from '../controllers/user.controller';
import { UserRepository } from '../repository/user.repository';
import { UserService } from '../services/user.service';

const router = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/register', userController.createUser.bind(userController));
router.post('/login', userController.loginUser.bind(userController));
router.post('/logout', userController.logoutUser.bind(userController));

export default router;
