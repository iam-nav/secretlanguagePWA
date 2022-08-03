import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    description: 'Date',
    default: 'April 21, 2000',
  })
  @IsNotEmpty({ message: 'Date should not be empty' })
  @IsString({ message: 'Date must be a string' })
  date_name: string;

  @ApiProperty({
    type: String,
    description: 'Name',
    default: 'John',
  })
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, {
    message: 'Name must be longer than or equal to 2 characters',
  })
  @MaxLength(40, {
    message: 'Name must be shorter than or equal to 40 characters',
  })
  name: string;

  @ApiProperty({
    type: Number,
    description: 'Gender',
    default: 1,
  })
  @IsNotEmpty({ message: 'Gender should not be empty' })
  @IsInt({ message: 'Gender must be an integer number' })
  @Min(1, { message: 'Gender must not be less than 1' })
  @Max(9, { message: 'Gender must not be greater than 9' })
  gender: any;

  @ApiProperty({
    type: String,
    description: 'Country name',
    default: 'Armenia',
  })
  @IsNotEmpty({ message: 'Country should not be empty' })
  @IsString({ message: 'Country must be a string' })
  country_name: string;

  @ApiProperty({
    type: String,
    description: 'Instagram',
    default: 'username',
  })
  @IsOptional()
  instagram?: string;

  @ApiProperty({
    type: Number,
    description: 'Gender Preference',
    default: 0,
  })
  @IsInt({ message: 'Gender preference must be an integer number' })
  @Min(0, { message: 'Gender preference must not be less than 0' })
  @Max(2, { message: 'Gender preference must not be greater than 2' })
  @IsOptional()
  gender_preference?: number;

  @ApiProperty({
    type: Number,
    description: 'Interested_in',
    default: 1,
  })
  @IsNotEmpty({ message: 'Interest should not be empty' })
  @IsInt({ message: 'Interest must be an integer number' })
  @Min(1, { message: 'Interest must not be less than 1' })
  @Max(3, { message: 'Interest must not be greater than 3' })
  @IsOptional()
  interested_in?: any;
}
