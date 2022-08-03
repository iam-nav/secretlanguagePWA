import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    type: String,
    description: 'Phone number',
    default: '+37444151415',
  })
  @IsNotEmpty({ message: 'Empty phone number' })
  phoneNumber: string;
}
