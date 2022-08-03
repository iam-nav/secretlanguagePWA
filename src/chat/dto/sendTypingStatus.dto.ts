import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class SendTypingStatusDto {
  @ApiProperty({
    type: Boolean,
    description: 'typing',
    default: true,
  })
  @IsNotEmpty({ message: 'Typing should not be empty' })
  @IsBoolean({ message: 'Typing must be boolean' })
  typing: boolean;
}
