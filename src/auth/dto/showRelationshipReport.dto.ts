import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ShowRelationshipReportDto {
  @ApiProperty({
    type: String,
    description: 'Birthday 1',
    default: 'January 10',
  })
  @IsNotEmpty({ message: 'Birthday 1 should not be empty' })
  @IsString({ message: 'Birthday 1 must be a string' })
  birthday_1: string;

  @ApiProperty({
    type: String,
    description: 'Birthday 2',
    default: 'July 20',
  })
  @IsNotEmpty({ message: 'Birthday 2 should not be empty' })
  @IsString({ message: 'Birthday 2 must be a string' })
  birthday_2: string;
}
