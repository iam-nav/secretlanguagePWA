import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    type: String,
    description: 'Phone number',
    default: '+37444151415',
  })
  @IsNotEmpty({ message: 'Empty phone number' })
  phoneNumber: string;

  @ApiProperty({
    type: String,
    description: 'Birthday',
    default: 'April 21, 2000',
  })
  @IsNotEmpty({ message: 'Birthday should not be empty' })
  @IsString({ message: 'Birthday must be a string' })
  birthday: string;
}
