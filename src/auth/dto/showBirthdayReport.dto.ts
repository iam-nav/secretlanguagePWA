import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ShowBirthdayReportDto {
  @ApiProperty({
    type: String,
    description: 'Birthday',
    default: 'April 21',
  })
  @IsNotEmpty({ message: 'Birthday should not be empty' })
  @IsString({ message: 'Birthday must be a string' })
  birthday: string;
}
