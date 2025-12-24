import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Identificador único do usuário no Google (sub)', example: '123456789012345678901' })
  @Index({ unique: true })
  @Column({ name: 'google_sub' })
  googleSub: string;

  @ApiProperty({ description: 'E-mail do usuário', example: 'usuario@gmail.com' })
  @Index({ unique: true })
  @Column({ name: 'email' })
  email: string;

  @ApiProperty({ description: 'Nome completo do usuário', example: 'Usuário Exemplo', required: false })
  @Column({ nullable: true })
  name?: string;

  @ApiProperty({ description: 'Data de criação do registro', example: '2025-01-10T12:00:00.000Z' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do registro', example: '2025-01-11T12:00:00.000Z' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
