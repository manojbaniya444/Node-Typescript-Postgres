import { queryDb } from '../config/db.config';

export class BaseRepository {
  constructor() {}

  async executeQuery(query: string, values: any[] = []) {
    try {
      const result = await queryDb(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}
