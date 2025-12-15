import { IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

import { CreateUserDto } from './create-user.dto';

export class CreateStaffDto extends CreateUserDto {
  @IsEnum(UserRole)
  role!: UserRole;
}
