import { ArrayMinSize, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LabResultDto {
  @IsString()
  testName!: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class CompleteLabRequestDto {
  @IsString()
  technicianName!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LabResultDto)
  results!: LabResultDto[];
}
