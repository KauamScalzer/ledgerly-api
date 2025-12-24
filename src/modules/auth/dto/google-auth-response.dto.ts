import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../user/entities/user.entity';

export class GoogleAuthResponseDto {
  @ApiProperty({ description: 'Token JWT para autenticação nas próximas requisições' })
  accessToken: string;

  @ApiProperty({ description: 'Usuário autenticado', type: () => User })
  user: User;
}
