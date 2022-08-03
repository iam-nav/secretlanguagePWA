import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CheckCodeDto {
  @ApiProperty({
    type: String,
    description: 'Phone number',
    default: '+37444151415',
  })
  @IsNotEmpty({ message: 'Empty phone number' })
  phoneNumber: string;

  @ApiProperty({
    type: String,
    description: 'OTP',
    default: '123456',
  })
  @IsNotEmpty({ message: 'OTP should not be empty' })
  @IsString({ message: 'OTP must be a string' })
  @Length(6, 6, {
    message: 'OTP must be longer than or equal to 6 characters',
  })
  otp: string;
}
