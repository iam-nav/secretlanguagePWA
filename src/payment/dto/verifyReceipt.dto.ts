import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyReceiptDto {
  @ApiProperty({
    type: String,
    description: 'Verify Receipt',
    default: 'receipt',
  })
  @IsNotEmpty({ message: 'Receipt should not be empty' })
  @IsString({ message: 'Receipt must be a string' })
  receipt: string;
}
