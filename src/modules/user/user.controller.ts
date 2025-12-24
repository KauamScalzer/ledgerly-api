import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('users')
export class UserController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Usuário autenticado', type: User })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente' })
  getMe(@Req() request: RequestWithUser): User {
    return request.user;
  }
}
