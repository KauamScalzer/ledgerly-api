import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('tags')
@Index(['ownerUserId', 'name'], { unique: true })
export class Tag {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID do usuário dono da tag', example: 1 })
  @Column({ name: 'owner_user_id' })
  ownerUserId: number;

  @ApiProperty({ description: 'Nome da tag', example: 'Alimentação' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Data de criação', example: '2025-01-10T12:00:00.000Z' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização', example: '2025-01-11T12:00:00.000Z' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
