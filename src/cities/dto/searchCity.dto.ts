import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SearchCityDto {
  @ApiProperty({
    type: String,
    description: 'Search Input',
    default: 'Los Angeles',
  })
  @IsNotEmpty({ message: 'Input should not be empty' })
  @IsString({ message: 'Input must be a string' })
  @MaxLength(20, {
    message: 'Input must be shorter than or equal to 20 characters',
  })
  input: string;
}
