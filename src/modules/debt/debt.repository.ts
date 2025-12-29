import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Debt, DebtType } from './entities/debt.entity';

export type DebtFilters = {
  ownerUserId: number;
  tagId?: number;
  type?: DebtType;
  paid?: boolean;
  overdue?: boolean;
  dueMonth?: { start: Date; end: Date };
  page: number;
  limit: number;
};

@Injectable()
export class DebtRepository {
  private readonly repository: Repository<Debt>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Debt);
  }

  create(data: Partial<Debt>): Debt {
    return this.repository.create(data);
  }

  save(debt: Debt): Promise<Debt> {
    return this.repository.save(debt);
  }

  async findFiltered(filters: DebtFilters): Promise<{ data: Debt[]; total: number }> {
    const { ownerUserId, tagId, type, paid, overdue, dueMonth, page, limit } = filters;

    const qb = this.repository
      .createQueryBuilder('debt')
      .leftJoinAndSelect('debt.tag', 'tag')
      .where('debt.ownerUserId = :ownerUserId', {
        ownerUserId,
      });

    if (tagId !== undefined) {
      qb.andWhere('debt.tagId = :tagId', { tagId });
    }

    if (type) {
      qb.andWhere('debt.type = :type', { type });
    }

    if (paid !== undefined) {
      qb.andWhere('debt.paid = :paid', { paid });
    }

    if (overdue) {
      qb.andWhere('debt.paid = false');
      qb.andWhere('debt.dueDate < :now', { now: new Date() });
    }

    if (dueMonth) {
      qb.andWhere('debt.dueDate >= :startOfMonth', { startOfMonth: dueMonth.start });
      qb.andWhere('debt.dueDate < :endOfMonth', { endOfMonth: dueMonth.end });
    }

    qb.orderBy('debt.dueDate', 'ASC');
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  findOneWithTag(id: number, ownerUserId: number): Promise<Debt | null> {
    return this.repository.findOne({
      where: { id, ownerUserId },
      relations: ['tag'],
    });
  }
}
