import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

type GoogleTokenPayload = {
  sub: string;
  email: string;
  name?: string | null;
};

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.googleClient = new OAuth2Client(clientId);
  }

  async loginWithGoogle(idToken: string): Promise<{ accessToken: string; user: User }> {
    const payload = await this.verifyGoogleToken(idToken);

    const user = await this.userService.upsertFromGoogleProfile({
      googleSub: payload.sub,
      email: payload.email,
      name: payload.name,
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      googleSub: user.googleSub,
      email: user.email,
    });

    return { accessToken, user };
  }

  private async verifyGoogleToken(idToken: string): Promise<GoogleTokenPayload> {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');

    if (!clientId) {
      throw new InternalServerErrorException('Google client id is not configured');
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: clientId,
      });

      const payload = ticket.getPayload();

      if (!payload?.sub || !payload?.email) {
        throw new UnauthorizedException('Google token is missing required data');
      }

      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name ?? payload.given_name ?? null,
      };
    } catch {
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
