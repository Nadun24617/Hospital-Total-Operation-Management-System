import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { UserStatus } from '@prisma/client';

import { CreateUserDto } from './create-user.dto';

export class CreatePatientDto extends CreateUserDto {
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsBoolean()
  isConfirmed?: boolean;
}
