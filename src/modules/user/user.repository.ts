import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  private readonly repository: Repository<User>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(User);
  }

  findByGoogleSub(googleSub: string): Promise<User | null> {
    return this.repository.findOne({ where: { googleSub } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  create(data: Partial<User>): User {
    return this.repository.create(data);
  }
}
