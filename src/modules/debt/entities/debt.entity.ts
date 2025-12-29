import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';

import { Tag } from '../../tag/entities/tag.entity';

export enum DebtType {
  PAYABLE = 'PAYABLE',
  RECEIVABLE = 'RECEIVABLE',
}

@Entity('debts')
@Index('IDX_debts_owner_due', ['ownerUserId', 'dueDate'])
export class Debt {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID do usuário dono do débito', example: 1 })
  @Column({ name: 'owner_user_id' })
  ownerUserId: number;

  @ApiProperty({ description: 'ID da tag associada', example: 2 })
  @Column({ name: 'tag_id' })
  tagId: number;

  @ApiProperty({ type: () => Tag })
  @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag?: Tag;

  @ApiProperty({ enum: DebtType, example: DebtType.PAYABLE })
  @Column({ type: 'enum', enum: DebtType })
  type: DebtType;

  @ApiProperty({ description: 'Valor em centavos', example: 12345 })
  @Column({ name: 'amount_cents', type: 'integer' })
  amountCents: number;

  @ApiProperty({ description: 'Descrição do débito', example: 'Conta de energia', required: false })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ description: 'Data de vencimento', example: '2025-01-31T00:00:00.000Z' })
  @Column({ name: 'due_date', type: 'timestamp with time zone' })
  dueDate: Date;

  @ApiProperty({ description: 'Indica se foi pago', example: false })
  @Column({ default: false })
  paid: boolean;

  @ApiProperty({ description: 'Data em que foi pago', example: '2025-02-01T12:00:00.000Z', required: false })
  @Column({ name: 'paid_at', type: 'timestamp with time zone', nullable: true })
  paidAt?: Date | null;

  @ApiProperty({ description: 'Data de criação', example: '2025-01-10T12:00:00.000Z' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização', example: '2025-01-11T12:00:00.000Z' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
