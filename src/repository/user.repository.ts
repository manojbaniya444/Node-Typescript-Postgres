import { IUser, User } from '../models/user.model';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository {
  async findById(id: number): Promise<User | null> {
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const result = await this.executeQuery(query, [id]);
      return result.length ? new User(result[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await this.executeQuery(query, [email]);
      return result.length ? new User(result[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, userData: Partial<IUser>): Promise<User> {
    try {
      const setClause = Object.keys(userData)
        .map((key, index) => `${this.handleCase(key)} = $${index + 2}`)
        .join(', ');
      const query = `UPDATE users
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
        RETURNING *
        `;
      const values = [id, ...Object.values(userData)];
      const result = await this.executeQuery(query, values);
      return new User(result[0]);
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData: Partial<IUser>): Promise<User> {
    try {
      const query = `
        INSERT INTO users (email, password, name)
        VALUES ($1, $2, $3)
        RETURNING *
        `;
      const values = [userData.email, userData.password, userData.name];
      const result = await this.executeQuery(query, values);
      return new User(result[0]);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<User[] | null> {
    try {
      const query = `SELECT * FROM users`;
      const result = await this.executeQuery(query);
      return result.length ? result.map((user: IUser) => new User(user)) : null;
    } catch (error) {
      throw error;
    }
  }

  private handleCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
  }
}
