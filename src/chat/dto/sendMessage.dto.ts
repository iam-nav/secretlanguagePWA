import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MessageTypes } from '../enum/message-types.enum';

export class SendMessageDto {
  @ApiProperty({
    type: String,
    description: 'Message type',
    default: MessageTypes.TEXT,
  })
  @IsNotEmpty({ message: 'Content should not be empty' })
  @IsEnum(MessageTypes, { message: 'Type must be a valid enum value' })
  type: MessageTypes;

  @ApiProperty({
    type: String,
    description: 'Content',
    default: 'Test message',
  })
  @IsNotEmpty({ message: 'Content should not be empty' })
  @IsString({ message: 'Content must be a string' })
  content: string;
}
