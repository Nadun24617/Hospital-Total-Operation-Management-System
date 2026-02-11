import { IsDateString, IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { UserRole } from '@prisma/client';

import { CreateUserDto } from './create-user.dto';

export class CreateStaffDto extends CreateUserDto {
  @IsEnum(UserRole)
  role!: UserRole;

  // Doctor-specific fields (used when role === DOCTOR)
  @IsOptional()
  @IsString()
  @MaxLength(50)
  slmcNumber?: string;

  @IsOptional()
  @IsInt()
  specializationId?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  joinedDate?: string;
}
