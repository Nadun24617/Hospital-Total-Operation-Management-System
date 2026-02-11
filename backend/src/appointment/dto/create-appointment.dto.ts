import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @IsInt()
  doctorId!: number;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  userId?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  patientName!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  contactNumber!: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  appointmentType!: string;

  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  timeSlot!: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
