import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateLabRequestDto {
  @IsString()
  patientName!: string;

  @IsOptional()
  @IsString()
  patientUserId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  appointmentId?: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  tests!: string[];
}
