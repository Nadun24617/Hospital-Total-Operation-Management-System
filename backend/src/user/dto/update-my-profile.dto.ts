import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateMyProfileDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^[0-9+()\-\s]{7,20}$/)
  phone!: string;
}
