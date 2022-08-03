import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SearchUsersDto {
  @ApiProperty({
    type: Number,
    description: 'Gender',
    default: 1,
  })
  @IsNotEmpty({ message: 'Empty gender field' })
  @IsInt({ message: 'Gender must be an integer number' })
  @Min(0, { message: 'Gender must not be less than 0' })
  @Max(9, { message: 'Gender must not be greater than 9' })
  gender: number;

  @ApiProperty({
    type: Number,
    description: 'Interest',
    default: 1,
  })
  @IsNotEmpty({ message: 'Empty interest field' })
  @IsInt({ message: 'Interest must be an integer number' })
  @Min(0, { message: 'Interest must not be less than 0' })
  @Max(3, { message: 'Interest must not be greater than 3' })
  interestedIn: number;

  @ApiProperty({
    type: [String],
    description: 'Ideal for',
    default: ['work', 'business'],
  })
  @IsString({ each: true, message: 'Each value in ideals must be a string' })
  @IsArray({ message: 'Ideals must be an array' })
  idealFor: string[];

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

  @ApiProperty({
    type: Number,
    description: 'Range',
    default: 10,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Empty range field' })
  @IsInt({ message: 'Range must be an integer number' })
  @Min(10, { message: 'Range must not be less than 10' })
  @Max(15000, { message: 'Range must not be greater than 15000' })
  range?: number;
}
