import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class GetSuggestionsDto {
  @ApiProperty({
    type: Number,
    description: 'Interest',
    default: 1,
  })
  @IsNotEmpty({ message: 'Empty interest field' })
  @IsInt({ message: 'Interest must be an integer number' })
  @Min(1, { message: 'Interest must not be less than 1' })
  @Max(3, { message: 'Interest must not be greater than 3' })
  interestedIn: number;
}
