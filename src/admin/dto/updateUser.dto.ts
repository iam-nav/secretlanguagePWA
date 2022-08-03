import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    type: Boolean,
    description: 'Attractive',
    default: false,
  })
  @IsNotEmpty({ message: 'Attractive should not be empty' })
  @IsBoolean({ message: 'Attractive must be a boolean' })
  attractive: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Verified',
    default: false,
  })
  @IsNotEmpty({ message: 'Is_verified should not be empty' })
  @IsBoolean({ message: 'Is_verified must be a boolean' })
  is_verified: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Vip',
    default: false,
  })
  @IsNotEmpty({ message: 'Vip should not be empty' })
  @IsBoolean({ message: 'Vip must be a boolean' })
  vip: boolean;
}
