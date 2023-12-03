import { Injectable } from '@nestjs/common';
import { User } from './user';

@Injectable()
export class UsersService {
  // TODO: this is where you'd build your user model and persistence layer, using your library of choice
  // (e.g., TypeORM, Sequelize, Mongoose, etc.)
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
