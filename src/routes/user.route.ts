import express from 'express';
import { UserController } from '../controllers/user.controller';

const router = express.Router();
const userController = new UserController();

router.post('/register', (req, res) => userController.createUser(req, res));
router.post('/login', (req, res) => userController.loginUser(req, res));
