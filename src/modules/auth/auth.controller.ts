import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { GoogleAuthResponseDto } from './dto/google-auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Login com Google realizado com sucesso', type: GoogleAuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Token Google inválido ou não autorizado' })
  @ApiBadRequestResponse({ description: 'Payload inválido' })
  @ApiInternalServerErrorResponse({ description: 'Configuração ausente ou erro interno' })
  async loginWithGoogle(@Body() body: GoogleAuthDto) {
    return this.authService.loginWithGoogle(body.token);
  }
}
