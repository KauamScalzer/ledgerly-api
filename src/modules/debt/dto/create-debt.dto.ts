import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

import { DebtType } from '../entities/debt.entity';

export class CreateDebtDto {
  @ApiProperty({ enum: DebtType, example: DebtType.PAYABLE })
  @IsEnum(DebtType)
  type: DebtType;

  @ApiProperty({ example: 2 })
  @IsInt()
  tagId: number;

  @ApiProperty({ description: 'Valor em centavos', example: 12345 })
  @IsInt()
  @IsPositive()
  amountCents: number;

  @ApiPropertyOptional({ description: 'Descrição do débito', example: 'Conta de energia' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ description: 'Data de vencimento', example: '2025-01-31T00:00:00.000Z' })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional({ description: 'Marca como pago', example: false })
  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @ApiPropertyOptional({ description: 'Data de pagamento', example: '2025-02-01T12:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  paidAt?: string;
}
