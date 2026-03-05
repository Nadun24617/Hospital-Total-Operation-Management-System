import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SymptomCheckDto {
  @IsNotEmpty({ message: 'Please describe your symptoms' })
  @IsString()
  @MinLength(10, { message: 'Please describe your symptoms in at least 10 characters' })
  @MaxLength(1000)
  symptoms!: string;
}
