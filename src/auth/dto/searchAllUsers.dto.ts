import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class SearchAllUsersDto {
  @ApiProperty({
    type: String,
    description: 'Search Input',
    default: 'John',
  })
  @IsString({ message: 'Input must be a string' })
  @MaxLength(20, {
    message: 'Input must be shorter than or equal to 20 characters',
  })
  input: string;

  @ApiProperty({
    type: Number,
    description: 'Gender',
    default: 1,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Empty gender field' })
  @IsInt({ message: 'Gender must be an integer number' })
  @Min(0, { message: 'Gender must not be less than 0' })
  @Max(2, { message: 'Gender must not be greater than 2' })
  gender: number;

  @ApiProperty({
    type: Number,
    description: 'Interest',
    default: 1,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Empty interest field' })
  @IsInt({ message: 'Interest must be an integer number' })
  @Min(0, { message: 'Interest must not be less than 0' })
  @Max(3, { message: 'Interest must not be greater than 3' })
  interestedIn: number;

  @ApiProperty({
    type: Number,
    description: 'Minimum age',
    default: 18,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Empty minAge field' })
  @IsInt({ message: 'MinAge must be an integer number' })
  @Min(18, { message: 'MinAge must not be less than 18' })
  @Max(99, { message: 'MinAge must not be greater than 99' })
  minAge?: number;

  @ApiProperty({
    type: Number,
    description: 'Maximum age',
    default: 99,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Empty maxAge field' })
  @IsInt({ message: 'MaxAge must be an integer number' })
  @Min(18, { message: 'MaxAge must not be less than 18' })
  @Max(99, { message: 'MaxAge must not be greater than 99' })
  maxAge?: number;
}
