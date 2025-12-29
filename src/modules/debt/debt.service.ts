import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

import { Debt, DebtType } from './entities/debt.entity';
import { DebtRepository } from './debt.repository';
import { TagRepository } from '../tag/tag.repository';
import { CreateDebtDto } from './dto/create-debt.dto';

export type ListDebtsInput = {
  ownerUserId: number;
  tagId?: number;
  type?: DebtType;
  paid?: boolean;
  overdue?: boolean;
  dueMonth?: string;
  page?: number;
  limit?: number;
};

@Injectable()
export class DebtService {
  constructor(
    private readonly debtRepository: DebtRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  async list(input: ListDebtsInput): Promise<{ data: Debt[]; total: number; page: number; limit: number }> {
    const page = input.page && input.page > 0 ? input.page : 1;
    const limit = input.limit && input.limit > 0 ? Math.min(input.limit, 100) : 10;

    let dueMonthRange: { start: Date; end: Date } | undefined;
    if (input.dueMonth) {
      const match = /^(\d{4})-(\d{2})$/.exec(input.dueMonth);
      if (!match) {
        throw new BadRequestException('dueMonth deve estar no formato YYYY-MM');
      }
      const year = Number(match[1]);
      const month = Number(match[2]) - 1; // zero-based
      const start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
      const end = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0));
      dueMonthRange = { start, end };
    }

    const { data, total } = await this.debtRepository.findFiltered({
      ownerUserId: input.ownerUserId,
      tagId: input.tagId,
      type: input.type,
      paid: input.paid,
      overdue: input.overdue,
      dueMonth: dueMonthRange,
      page,
      limit,
    });

    return { data, total, page, limit };
  }

  async create(ownerUserId: number, dto: CreateDebtDto): Promise<Debt> {
    const tag = await this.tagRepository.findByOwnerAndId(ownerUserId, dto.tagId);
    if (!tag) {
      throw new NotFoundException('Tag não encontrada para este usuário');
    }

    const paid = dto.paid ?? false;
    if (dto.paidAt && paid === false) {
      throw new BadRequestException('paidAt não pode ser enviado quando paid é falso');
    }

    const dueDate = new Date(dto.dueDate);
    if (Number.isNaN(dueDate.getTime())) {
      throw new BadRequestException('Data de vencimento inválida');
    }

    let paidAt: Date | null = null;
    if (dto.paidAt) {
      paidAt = new Date(dto.paidAt);
      if (Number.isNaN(paidAt.getTime())) {
        throw new BadRequestException('Data de pagamento inválida');
      }
    }

    const debt = this.debtRepository.create({
      ownerUserId,
      tagId: dto.tagId,
      type: dto.type,
      amountCents: dto.amountCents,
      description: dto.description?.trim() || undefined,
      dueDate,
      paid,
      paidAt: paidAt ?? null,
    });

    if (!debt.paid) {
      debt.paidAt = null;
    }

    const saved = await this.debtRepository.save(debt);
    return this.debtRepository.findOneWithTag(saved.id, ownerUserId) as Promise<Debt>;
  }
}
