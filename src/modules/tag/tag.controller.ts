import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../auth/guards/jwt-auth.guard';
import { Tag } from './entities/tag.entity';
import { TagService } from './tag.service';

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Tags do usuário autenticado', type: [Tag] })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente' })
  @ApiQuery({ name: 'search', required: false, description: 'Filtro de busca pelo nome da tag' })
  getTags(@Req() req: RequestWithUser, @Query('search') search?: string): Promise<Tag[]> {
    return this.tagService.findByOwner(req.user.id, search);
  }
}
