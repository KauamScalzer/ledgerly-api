import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';

import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn = (configService.get<string>('JWT_EXPIRES_IN') ?? '7d') as JwtSignOptions['expiresIn'];

        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn },
        };
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
