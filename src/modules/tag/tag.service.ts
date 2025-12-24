import { Injectable } from '@nestjs/common';

import { Tag } from './entities/tag.entity';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async create(data: { ownerUserId: number; name: string }): Promise<Tag> {
    const tag = this.tagRepository.create(data);
    return this.tagRepository.save(tag);
  }

  findByOwner(ownerUserId: number, search?: string): Promise<Tag[]> {
    return this.tagRepository.findByOwner(ownerUserId, search);
  }
}
