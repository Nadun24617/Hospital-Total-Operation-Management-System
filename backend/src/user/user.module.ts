import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/roles.guard';
import { AdminUserController } from './admin-user.controller';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AuthModule],
  providers: [UserService, RolesGuard],
  controllers: [UserController, AdminUserController],
  exports: [UserService]
})
export class UserModule {}
