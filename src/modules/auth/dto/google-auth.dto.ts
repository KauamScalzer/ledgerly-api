import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty({ description: 'ID Token retornado pelo Google Identity', example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...' })
  @IsString()
  token: string;
}
