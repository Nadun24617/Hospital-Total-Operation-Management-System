import { IsOptional, IsString } from 'class-validator';

export class MarkSampleCollectedDto {
  @IsOptional()
  @IsString()
  technicianName?: string;
}
