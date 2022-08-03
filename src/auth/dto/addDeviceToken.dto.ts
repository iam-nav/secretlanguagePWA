import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddDeviceTokenDto {
  @ApiProperty({
    type: String,
    description: 'Device Token',
    default: 'string',
  })
  @IsNotEmpty({ message: 'Device token should not be empty' })
  @IsString({ message: 'Device token must be a string' })
  device_token: string;
}
