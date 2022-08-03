import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/entity/user.entity';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ChatInterface } from './interfaces/chat.interface';
import { ChatMessagesSW, ChatsSW, Global } from '../swagger.response';
import { GlobalResponse } from '../auth/interfaces/global-response.interface';
import { ChatMessagesInterface } from './interfaces/chat-messages.interface';
import { SendMessageDto } from './dto/sendMessage.dto';
import { HttpExceptionFilter } from '../auth/http-exception.filter';
import { SendTypingStatusDto } from './dto/sendTypingStatus.dto';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chats')
@UseFilters(new HttpExceptionFilter())
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/:offset')
  @ApiCreatedResponse({ type: [ChatsSW] })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async getChatsWithPagination(
    @GetUser() user: User,
    @Param('offset') offset: number,
  ): Promise<ChatInterface[]> {
    return this.chatService.getChatsWithPagination(user, offset);
  }

  @Get('/:chatId/messages/:messageId')
  @ApiCreatedResponse({ type: [ChatMessagesSW] })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async getChatMessages(
    @GetUser() user: User,
    @Param('chatId') chatId: number,
    @Param('messageId') messageId: number,
  ): Promise<ChatMessagesInterface[]> {
    return this.chatService.getChatMessages(user, chatId, messageId);
  }

  @Post('/sendMessage/:chatId')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async sendTextMessage(
    @GetUser() user: User,
    @Body() body: SendMessageDto,
    @Param('chatId') chatId: number,
  ): Promise<GlobalResponse> {
    return this.chatService.sendMessage(user, body, chatId);
  }

  @Post('/sendGreetingMessage/:userId')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async sendGreetingMessage(
    @GetUser() user: User,
    @Body() body: SendMessageDto,
    @Param('userId') userId: number,
  ): Promise<GlobalResponse> {
    return this.chatService.sendGreetingMessage(user, body, userId);
  }

  @Post('/sendTyping/:chatId')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async sendTypingStatus(
    @GetUser() user: User,
    @Body() body: SendTypingStatusDto,
    @Param('chatId') chatId: number,
  ): Promise<GlobalResponse> {
    return this.chatService.sendTypingStatus(user, body, chatId);
  }

  @Delete('/:chatId')
  @ApiCreatedResponse({ type: Global })
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe())
  async deleteChat(
    @GetUser() user: User,
    @Param('chatId') chatId: number,
  ): Promise<GlobalResponse> {
    return this.chatService.deleteChat(user, chatId);
  }
}
