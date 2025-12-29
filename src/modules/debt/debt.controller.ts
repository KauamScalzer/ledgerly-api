import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../auth/guards/jwt-auth.guard';
import { Debt, DebtType } from './entities/debt.entity';
import { DebtListResponseDto } from './dto/debt-list-response.dto';
import { CreateDebtDto } from './dto/create-debt.dto';
import { DebtService } from './debt.service';

@ApiTags('Debts')
@Controller('debts')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Lista de débitos do usuário com paginação', type: DebtListResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente' })
  @ApiQuery({ name: 'tagId', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: DebtType })
  @ApiQuery({ name: 'paid', required: false, type: Boolean })
  @ApiQuery({ name: 'overdue', required: false, type: Boolean })
  @ApiQuery({ name: 'dueMonth', required: false, description: 'Filtro por mês de vencimento (YYYY-MM)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Página (default 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Itens por página (default 10, máximo 100)' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno' })
  async listDebts(
    @Req() req: RequestWithUser,
    @Query('tagId') tagId?: string,
    @Query('type') type?: DebtType,
    @Query('paid') paid?: string,
    @Query('overdue') overdue?: string,
    @Query('dueMonth') dueMonth?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ data: Debt[]; total: number; page: number; limit: number }> {
    const parsedTagId = tagId ? Number(tagId) : undefined;
    const parsedPaid = paid !== undefined ? paid === 'true' : undefined;
    const parsedOverdue = overdue !== undefined ? overdue === 'true' : undefined;
    const parsedPage = page ? Number(page) : undefined;
    const parsedLimit = limit ? Number(limit) : undefined;

    return this.debtService.list({
      ownerUserId: req.user.id,
      tagId: Number.isNaN(parsedTagId) ? undefined : parsedTagId,
      type,
      paid: parsedPaid,
      overdue: parsedOverdue,
      dueMonth,
      page: parsedPage,
      limit: parsedLimit,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Dívida criada', type: Debt })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno' })
  createDebt(@Req() req: RequestWithUser, @Body() body: CreateDebtDto): Promise<Debt> {
    return this.debtService.create(req.user.id, body);
  }
}
