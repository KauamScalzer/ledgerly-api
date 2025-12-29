import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { TagModule } from '../tag/tag.module';
import { Debt } from './entities/debt.entity';
import { DebtController } from './debt.controller';
import { DebtRepository } from './debt.repository';
import { DebtService } from './debt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Debt]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => TagModule),
  ],
  controllers: [DebtController],
  providers: [DebtService, DebtRepository],
  exports: [DebtService, DebtRepository],
})
export class DebtModule {}
