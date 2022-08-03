import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddPaidReportDto {
  @ApiProperty({
    type: String,
    description: 'Birthday',
    default: 'April 21',
    required: false,
  })
  @IsNotEmpty({ message: 'Birthday should not be empty' })
  @IsString({ message: 'Birthday must be a string' })
  @IsOptional()
  birthday?: string;

  @ApiProperty({
    type: String,
    description: 'Birthday 1',
    default: 'April 21',
    required: false,
  })
  @IsNotEmpty({ message: 'Birthday 1 should not be empty' })
  @IsString({ message: 'Birthday 1 must be a string' })
  @IsOptional()
  birthday_1?: string;

  @ApiProperty({
    type: String,
    description: 'Birthday 2',
    default: 'July 10',
    required: false,
  })
  @IsNotEmpty({ message: 'Birthday 2 should not be empty' })
  @IsString({ message: 'Birthday 2 must be a string' })
  @IsOptional()
  birthday_2?: string;

  @ApiProperty({
    type: String,
    description: 'Receipt',
    default: 'receipt',
  })
  @IsNotEmpty({ message: 'Receipt should not be empty' })
  @IsString({ message: 'Receipt must be a string' })
  receipt: string;
}
