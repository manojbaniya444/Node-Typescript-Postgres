import { BaseError } from './base.error';

export class AuthenticationError extends BaseError {
  constructor(message: string = 'Authentication Error') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}
