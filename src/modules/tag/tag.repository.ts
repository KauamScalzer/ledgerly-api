import { Injectable } from '@nestjs/common';
import { DataSource, Repository, ILike } from 'typeorm';

import { Tag } from './entities/tag.entity';

@Injectable()
export class TagRepository {
  private readonly repository: Repository<Tag>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Tag);
  }

  create(data: Partial<Tag>): Tag {
    return this.repository.create(data);
  }

  save(tag: Tag): Promise<Tag> {
    return this.repository.save(tag);
  }

  findByOwner(ownerUserId: number, search?: string): Promise<Tag[]> {
    const where = search
      ? { ownerUserId, name: ILike(`%${search}%`) }
      : { ownerUserId };

    return this.repository.find({
      where,
      order: { name: 'ASC' },
    });
  }
}
