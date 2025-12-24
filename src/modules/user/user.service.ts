import { Injectable } from '@nestjs/common';

import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';

type GoogleProfile = {
  googleSub: string;
  email: string;
  name?: string | null;
};

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async findByGoogleSub(googleSub: string): Promise<User | null> {
    return this.userRepository.findByGoogleSub(googleSub);
  }

  async upsertFromGoogleProfile(profile: GoogleProfile): Promise<User> {
    const { googleSub, email, name } = profile;

    const user =
      (await this.userRepository.findByGoogleSub(googleSub)) ||
      (await this.userRepository.findByEmail(email));

    if (user) {
      user.googleSub = googleSub;
      user.email = email;
      user.name = name ?? user.name;
      return this.userRepository.save(user);
    }

    const newUser = this.userRepository.create({
      googleSub,
      email,
      name: name ?? undefined,
    });

    return this.userRepository.save(newUser);
  }
}
