import { ApiProperty } from '@nestjs/swagger';

import { Debt } from '../entities/debt.entity';

export class DebtListResponseDto {
  @ApiProperty({ type: () => [Debt] })
  data: Debt[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 42 })
  total: number;
}
