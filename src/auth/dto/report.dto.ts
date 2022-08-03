import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class ReportedDto {
  @ApiProperty({
    type: Number,
    description: 'Reported User id',
    default: 1,
  })
  @IsNotEmpty({ message: 'Id should not be empty' })
  @IsInt({ message: 'Id must be an integer number' })
  @Min(1, { message: 'Id must not be less than 1' })
  id: number;
}
