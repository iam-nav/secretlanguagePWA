import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as async from 'async';
import * as _ from 'lodash';
import { User } from '../auth/entity/user.entity';
import { ChatRepository } from './repository/chat.repository';
import { HelperService } from '../helper.service';
import { ChatInterface } from './interfaces/chat.interface';
import { UserRepository } from '../auth/repository/user.repository';
import { MessageRepository } from './repository/message.repository';
import { GlobalResponse } from '../auth/interfaces/global-response.interface';
import * as moment from 'moment';
import { RelationshipRepository } from '../relationship/repository/relationship.repository';
import { ChatMessagesInterface } from './interfaces/chat-messages.interface';
import { ConflictException } from '@nestjs/common';
import { Message } from './entity/message.entity';
import { SendMessageDto } from './dto/sendMessage.dto';
import { SendTypingStatusDto } from './dto/sendTypingStatus.dto';
import { PusherService } from '../pusher.service';
import { AWSService } from '../aws.service';
import { NotificationService } from '../notification.service';
import { Chat } from './entity/chat.entity';
import { BlockedRepository } from '../block/repository/block.repository';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRepository)
    private chatRepository: ChatRepository,
    @InjectRepository(MessageRepository)
    private messageRepository: MessageRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(RelationshipRepository)
    private relationshipRepository: RelationshipRepository,
    @InjectRepository(BlockedRepository)
    private blockedRepository: BlockedRepository,
    private helperService: HelperService,
    private pusherService: PusherService,
    private awsService: AWSService,
    private notificationService: NotificationService,
  ) {}

  async getChatsWithPagination(
    user: User,
    offset: number,
  ): Promise<ChatInterface[]> {
    if (user.user_type !== 2) {
      throw new UnprocessableEntityException(
        `You don't have permission to perform this action. Please subscribe one of this plans`,
      );
    }

    const take = 12;
    if (isNaN(offset) || offset < 1) offset = 1;

    const chats = await this.chatRepository
      .createQueryBuilder('a_chats')
      .where('a_chats.users @> :id', { id: [user.id] })
      .leftJoinAndSelect('a_chats.latestMessage', 'latestMessage')
      .orderBy('a_chats.updatedAt', 'DESC')
      .skip(take * (Number(offset) - 1))
      .take(take)
      .getMany();

    const usersIds: any = [];
    chats.map((c) =>
      usersIds.push(c.users.filter((id: any) => id !== user.id)[0]),
    );

    const users: User[] = await this.userRepository
      .createQueryBuilder('a_users')
      .select([
        'a_users.id',
        'a_users.name',
        'a_users.date_name',
        'a_users.image_path',
        'week_id.id',
      ])
      .whereInIds(usersIds)
      .leftJoin('a_users.week_id', 'week_id')
      .getMany();

    const result = await async.map(chats, async (chat: any) => {
      let week1: any, week2: any;
      chat.users = chat.users.filter((id: any) => id !== user.id)[0];
      const chatUser = users.find((u) => u.id === chat.users);

      chat.chatName = chatUser ? chatUser.name : chat.chatName;
      chat.image =
        chatUser && chatUser.image
          ? chatUser.image.replace('?tr=w-600,h-600', '?tr=w-50,h-50')
          : `${process.env.IMAGE_KIT}default.png?tr=w-50,h-50`;
      if (chat.latestMessage) {
        chat.message = {
          id: chat.latestMessage && chat.latestMessage.id,
          content: chat.latestMessage && chat.latestMessage.content,
          type: chat.latestMessage && chat.latestMessage.type,
          created_at: chat.latestMessage
            ? this.helperService.changeTimeFormat(chat.latestMessage.createdAt)
            : '',
        };
      } else {
        chat.message = null;
      }

      if (user.week_id.id < chatUser.week_id.id) {
        week1 = user.week_id.id;
        week2 = chatUser.week_id.id;
      } else {
        week1 = chatUser.week_id.id;
        week2 = user.week_id.id;
      }

      // eslint-disable-next-line prefer-const
      let [rel, count] = await Promise.all([
        await this.relationshipRepository
          .createQueryBuilder('c_relationship')
          .select('c_relationship.ideal')
          .where(
            'c_relationship.week1 = :week1 AND c_relationship.week2 = :week2',
            { week1, week2 },
          )
          .getOne(),
        await this.messageRepository
          .createQueryBuilder('a_messages')
          .where('a_messages.chat = :chatId', { chatId: chat.id })
          .andWhere('a_messages.sender_user != :id', { id: user.id })
          .orderBy('a_messages.id', 'DESC')
          .take(10)
          .getMany(),
      ]);

      chat.user = {
        id: chatUser && chatUser.id,
        name: chatUser && chatUser.name,
        image:
          chatUser &&
          chatUser.image.replace('?tr=w-600,h-600', '?tr=w-50,h-50'),
        age: moment().diff(
          moment(chatUser.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
          'years',
        ),
        ideal_for: rel ? rel.ideal : '',
      };

      count = count.filter((c) => !c.readBy.includes(user.id));

      if (count.length > 10 || count.length === 10) {
        chat.unread_messages_count = `9+`;
        chat.read = false;
      } else if (count.length > 0) {
        chat.unread_messages_count = `${count.length}`;
        chat.read = false;
      } else {
        chat.unread_messages_count = '0';
        chat.read = true;
      }

      chat.users = undefined;
      chat.latestMessage = undefined;
      chat.isGroupChat = undefined;

      return chat;
    });

    return result;
  }

  async getOtherUserChatsWithPagination(
    user: User,
    page: number,
  ): Promise<ChatInterface[]> {
    const take = 12;
    if (isNaN(page) || page < 1) page = 1;

    const chats = await this.chatRepository
      .createQueryBuilder('a_chats')
      .where('a_chats.users @> :id', { id: [user.id] })
      .leftJoinAndSelect('a_chats.latestMessage', 'latestMessage')
      .orderBy('a_chats.updatedAt', 'DESC')
      .skip(take * (Number(page) - 1))
      .take(take)
      .getMany();

    const usersIds: any = [];
    chats.map((c) =>
      usersIds.push(c.users.filter((id: any) => id !== user.id)[0]),
    );

    const users: User[] = await this.userRepository
      .createQueryBuilder('a_users')
      .select([
        'a_users.id',
        'a_users.name',
        'a_users.date_name',
        'a_users.image_path',
        'week_id.id',
      ])
      .whereInIds(usersIds)
      .leftJoin('a_users.week_id', 'week_id')
      .getMany();

    const result = await async.map(chats, async (chat: any) => {
      let week1: any, week2: any;
      chat.users = chat.users.filter((id: any) => id !== user.id)[0];
      const chatUser = users.find((u) => u.id === chat.users);

      chat.chatName = chatUser ? chatUser.name : chat.chatName;
      chat.image =
        chatUser && chatUser.image
          ? chatUser.image.replace('?tr=w-600,h-600', '?tr=w-50,h-50')
          : `${process.env.IMAGE_KIT}default.png?tr=w-50,h-50`;
      if (chat.latestMessage) {
        chat.message = {
          id: chat.latestMessage && chat.latestMessage.id,
          content: chat.latestMessage && chat.latestMessage.content,
          type: chat.latestMessage && chat.latestMessage.type,
          created_at: chat.latestMessage
            ? this.helperService.changeTimeFormat(chat.latestMessage.createdAt)
            : '',
        };
      } else {
        chat.message = null;
      }

      if (user.week_id.id < chatUser.week_id.id) {
        week1 = user.week_id.id;
        week2 = chatUser.week_id.id;
      } else {
        week1 = chatUser.week_id.id;
        week2 = user.week_id.id;
      }

      // eslint-disable-next-line prefer-const
      let [rel, count] = await Promise.all([
        await this.relationshipRepository
          .createQueryBuilder('c_relationship')
          .select('c_relationship.ideal')
          .where(
            'c_relationship.week1 = :week1 AND c_relationship.week2 = :week2',
            { week1, week2 },
          )
          .getOne(),
        await this.messageRepository
          .createQueryBuilder('a_messages')
          .where('a_messages.chat = :chatId', { chatId: chat.id })
          .andWhere('a_messages.sender_user != :id', { id: user.id })
          .orderBy('a_messages.id', 'DESC')
          .take(10)
          .getMany(),
      ]);

      chat.user = {
        id: chatUser && chatUser.id,
        name: chatUser && chatUser.name,
        image: chatUser && chatUser.image,
        age: moment().diff(
          moment(chatUser.date_name, 'MMM DD, YYYY').format('YYYY-MM-DD'),
          'years',
        ),
        ideal_for: rel ? rel.ideal : '',
      };

      count = count.filter((c) => !c.readBy.includes(user.id));

      if (count.length > 10 || count.length === 10) {
        chat.unread_messages_count = `9+`;
        chat.read = false;
      } else if (count.length > 0) {
        chat.unread_messages_count = `${count.length}`;
        chat.read = false;
      } else {
        chat.unread_messages_count = '0';
        chat.read = true;
      }

      chat.users = undefined;
      chat.latestMessage = undefined;
      chat.isGroupChat = undefined;

      return chat;
    });

    return result;
  }

  async getChatMessages(
    user: User,
    chatId: number,
    messageId: number,
  ): Promise<ChatMessagesInterface[]> {
    if (user.user_type !== 2) {
      throw new UnprocessableEntityException(
        `You don't have permission to perform this action. Please subscribe one of this plans`,
      );
    }

    const id: any = user.id;
    messageId = Number(messageId);
    chatId = Number(chatId);
    let messages: any;

    if (isNaN(messageId) || messageId < 0) {
      throw new BadRequestException(
        'Please select message id for get messages',
      );
    }

    if (isNaN(chatId) || chatId < 0) {
      throw new BadRequestException('Please select chat id for get messages');
    }

    const [chat, messagesCount] = await Promise.all([
      await this.chatRepository
        .createQueryBuilder('a_chats')
        .where('a_chats.id = :chatId', { chatId })
        .getOne(),
      await this.messageRepository
        .createQueryBuilder('a_messages')
        .where('a_messages.chat = :chatId', { chatId })
        .getMany(),
    ]);

    if (!chat)
      throw new NotFoundException('There is no chat with this credentials');
    else {
      if (chat.users && !chat.users.includes(id)) {
        throw new ConflictException('There is no chat with this credentials');
      }
    }

    await async.map(messagesCount, async (mc: any) => {
      if (!mc.readBy.includes(id)) {
        mc.readBy = [...mc.readBy, id];
        await mc.save();
      }
    });

    if (messageId === 0) {
      messages = await this.messageRepository
        .createQueryBuilder('a_messages')
        .where('a_messages.chat = :chatId', { chatId })
        .leftJoinAndSelect('a_messages.user', 'user')
        .orderBy('a_messages.id', 'DESC')
        .take(7)
        .getMany();
    } else {
      messages = await this.messageRepository
        .createQueryBuilder('a_messages')
        .where('a_messages.chat = :chatId', { chatId })
        .andWhere('a_messages.id < :messageId', { messageId })
        .leftJoinAndSelect('a_messages.user', 'user')
        .orderBy('a_messages.id', 'DESC')
        .take(7)
        .getMany();
    }

    messages = await async.map(messages, async (m) => {
      if (m.user.id === id) {
        m.readBy.includes(id) && m.readBy.length > 1
          ? (m.read = true)
          : (m.read = false);
      } else {
        m.readBy.includes(id) ? (m.read = true) : (m.read = false);
      }

      return {
        ...m,
        readBy: undefined,
        user: {
          id: m.user && m.user.id,
          name: m.user && m.user.name,
          image: m.user && m.user.image,
        },
        created_at: this.helperService.changeTimeFormat(m.createdAt),
        createdAt: undefined,
        updatedAt: undefined,
      };
    });

    // eslint-disable-next-line prefer-const
    messages = await _.orderBy(messages, 'id', 'ASC');

    return messages;
  }

  async sendMessage(
    user: User,
    body: SendMessageDto,
    chatId: number,
    greeting?: boolean,
  ): Promise<GlobalResponse> {
    if (!greeting)
      if (user.user_type !== 2) {
        throw new UnprocessableEntityException(
          `You don't have permission to perform this action. Please subscribe one of this plans`,
        );
      }

    const id: any = user.id;
    const { type, content } = body;

    if (isNaN(chatId) || chatId < 0) {
      throw new BadRequestException('Please select chat id for send message');
    }

    if (
      !content ||
      (typeof content === 'string' && !content.replace(/ */g, ''))
    ) {
      throw new ConflictException("You can't send empty message");
    }

    const checkChat = await this.chatRepository
      .createQueryBuilder('a_chats')
      .where('a_chats.id = :id', { id: Number(chatId) })
      .andWhere('a_chats.users @> :userId', { userId: [id] })
      .getOne();

    if (!checkChat) {
      throw new NotFoundException('There is no chat with this credentials');
    }

    const getChatUser = checkChat.users.filter((u) => u !== user.id)[0];

    if (getChatUser && getChatUser !== 0) {
      const checkBlock = await this.blockedRepository
        .createQueryBuilder('a_user_blocked')
        .where(
          'a_user_blocked.blocked_by = :blocked_by AND a_user_blocked.blocked_to = :blocked_to OR a_user_blocked.blocked_by = :blocked_to AND a_user_blocked.blocked_to = :blocked_by',
          {
            blocked_by: id,
            blocked_to: getChatUser,
          },
        )
        .getCount();

      if (checkBlock !== 0) {
        throw new BadRequestException(
          `You can't send messages. The user blocked by you or you blocked by the user.`,
        );
      }
    }

    if (type === 'text') {
      try {
        const msg = await this.messageRepository
          .createQueryBuilder('a_messages')
          .insert()
          .into(Message)
          .values([
            {
              content: [
                {
                  type,
                  message: content,
                },
              ],
              type: type,
              readBy: [id],
              user: id,
              chat: () => `${checkChat.id}`,
            },
          ])
          .returning('*')
          .execute()
          .then((response) => response.raw[0]);

        try {
          await this.chatRepository
            .createQueryBuilder('a_chats')
            .update()
            .set({ latestMessage: msg.id })
            .where('a_chats.id = :id', {
              id: msg.chat,
            })
            .execute();

          const u = checkChat.users.filter((u) => u !== id);

          if (u.length > 0) {
            const otherUser = await this.userRepository
              .createQueryBuilder('a_users')
              .where('a_users.id = :id', {
                id: u[0],
              })
              .leftJoinAndSelect('a_users.gender', 'gender')
              .leftJoinAndSelect('a_users.week_id', 'week_id')
              .getOne();

            if (otherUser) {
              const otherUsernameChats =
                await this.getOtherUserChatsWithPagination(otherUser, 1);
              this.pusherService.trigger(
                otherUser.username,
                'chats',
                otherUsernameChats,
              );
            }

            if (greeting) {
              const fullMessage = await this.messageRepository
                .createQueryBuilder('a_messages')
                .where('a_messages.id = :id', { id: msg.id })
                .leftJoinAndSelect('a_messages.user', 'user')
                .getOne();

              let result: any = {};

              if (fullMessage.user.id === id) {
                fullMessage.readBy.includes(id) && fullMessage.readBy.length > 1
                  ? (result.read = true)
                  : (result.read = false);
              } else {
                fullMessage.readBy.includes(id)
                  ? (result.read = true)
                  : (result.read = false);
              }

              result = {
                ...fullMessage,
                read: false,
                readBy: undefined,
                user: {
                  id: fullMessage.user && fullMessage.user.id,
                  name: fullMessage.user && fullMessage.user.name,
                  image: fullMessage.user && fullMessage.user.image,
                },
                created_at: this.helperService.changeTimeFormat(msg.createdAt),
                createdAt: undefined,
                updatedAt: undefined,
              };

              this.pusherService.trigger(
                otherUser.username,
                `chatMessage${checkChat.id}`,
                result,
              );
            } else {
              const fullMessage = await this.messageRepository
                .createQueryBuilder('a_messages')
                .where('a_messages.id = :id', { id: msg.id })
                .leftJoinAndSelect('a_messages.user', 'user')
                .getOne();

              let result: any = {};

              if (fullMessage.user.id === id) {
                fullMessage.readBy.includes(id) && fullMessage.readBy.length > 1
                  ? (result.read = true)
                  : (result.read = false);
              } else {
                fullMessage.readBy.includes(id)
                  ? (result.read = true)
                  : (result.read = false);
              }

              result = {
                ...fullMessage,
                read: false,
                readBy: undefined,
                user: {
                  id: fullMessage.user && fullMessage.user.id,
                  name: fullMessage.user && fullMessage.user.name,
                  image: fullMessage.user && fullMessage.user.image,
                },
                created_at: this.helperService.changeTimeFormat(msg.createdAt),
                createdAt: undefined,
                updatedAt: undefined,
              };

              this.pusherService.trigger(
                otherUser.username,
                `chatMessage${checkChat.id}`,
                result,
              );
              this.pusherService.trigger(
                user.username,
                `chatMessage${checkChat.id}`,
                result,
              );
            }

            if (otherUser.device_token)
              this.notificationService.sendNotification(
                'New Message',
                `${user.name ? `${user.name}: ` : ''}${
                  msg.content.length > 0 &&
                  msg.content[0] &&
                  msg.content[0].message
                    ? msg.content[0].message
                    : 'You have a new unread message'
                }`,
                otherUser.device_token,
                'open.chats',
              );
          }

          return {
            status: 'access',
            message: 'Sent!',
          };
        } catch (err) {
          throw new InternalServerErrorException(err.message);
        }
      } catch (err) {
        throw new InternalServerErrorException(err.message);
      }
    } else {
      const file = await this.awsService.sendFileMessage(
        type,
        content,
        `chat/${checkChat.id}`,
      );

      if (!file)
        throw new BadRequestException(
          'Please upload another file or try again',
        );

      try {
        const msg = await this.messageRepository
          .createQueryBuilder('a_messages')
          .insert()
          .into(Message)
          .values([
            {
              content: [
                {
                  type,
                  message: file.Key,
                },
              ],
              type,
              readBy: [id],
              user: id,
              chat: () => `${checkChat.id}`,
            },
          ])
          .returning('*')
          .execute()
          .then((response) => response.raw[0]);

        try {
          await this.chatRepository
            .createQueryBuilder('a_chats')
            .update()
            .set({ latestMessage: msg.id })
            .where('a_chats.id = :id', {
              id: msg.chat,
            })
            .execute();

          const u = checkChat.users.filter((u) => u !== id);

          if (u.length > 0) {
            const otherUser = await this.userRepository
              .createQueryBuilder('a_users')
              .where('a_users.id = :id', {
                id: u[0],
              })
              .leftJoinAndSelect('a_users.gender', 'gender')
              .leftJoinAndSelect('a_users.week_id', 'week_id')
              .getOne();

            if (otherUser) {
              const otherUsernameChats =
                await this.getOtherUserChatsWithPagination(otherUser, 1);
              this.pusherService.trigger(
                otherUser.username,
                'chats',
                otherUsernameChats,
              );
            }

            const fullMessage = await this.messageRepository
              .createQueryBuilder('a_messages')
              .where('a_messages.id = :id', { id: msg.id })
              .leftJoinAndSelect('a_messages.user', 'user')
              .getOne();

            let result: any = {};

            if (fullMessage.user.id === id) {
              fullMessage.readBy.includes(id) && fullMessage.readBy.length > 1
                ? (result.read = true)
                : (result.read = false);
            } else {
              fullMessage.readBy.includes(id)
                ? (result.read = true)
                : (result.read = false);
            }

            result = {
              ...fullMessage,
              read: false,
              readBy: undefined,
              user: {
                id: fullMessage.user && fullMessage.user.id,
                name: fullMessage.user && fullMessage.user.name,
                image: fullMessage.user && fullMessage.user.image,
              },
              created_at: this.helperService.changeTimeFormat(msg.createdAt),
              createdAt: undefined,
              updatedAt: undefined,
            };

            this.pusherService.trigger(
              otherUser.username,
              `chatMessage${checkChat.id}`,
              result,
            );
            this.pusherService.trigger(
              user.username,
              `chatMessage${checkChat.id}`,
              result,
            );
            if (otherUser.device_token)
              this.notificationService.sendNotification(
                'New Message',
                `${user.name ? `${user.name}: ` : ''}📥 File`,
                otherUser.device_token,
                'open.chats',
              );
          }

          return {
            status: 'access',
            message: 'Media sent!',
          };
        } catch (err) {
          throw new InternalServerErrorException(err.message);
        }
      } catch (err) {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  async sendGreetingMessage(
    user: User,
    body: SendMessageDto,
    userId: number,
  ): Promise<GlobalResponse> {
    const id: any = user.id;
    const { content } = body;

    if (isNaN(userId) || userId < 0) {
      throw new BadRequestException('Please select user id for send message');
    }

    if (
      !content ||
      (typeof content === 'string' && !content.replace(/ */g, ''))
    ) {
      throw new ConflictException("You can't send empty message");
    }

    const checkUser = await this.userRepository
      .createQueryBuilder('a_users')
      .where('a_users.id = :userId', { userId })
      .getOne();

    if (!checkUser) {
      throw new NotFoundException('There is no user with this id');
    }

    const checkBlock = await this.blockedRepository
      .createQueryBuilder('a_user_blocked')
      .where(
        'a_user_blocked.blocked_by = :blocked_by AND a_user_blocked.blocked_to = :blocked_to OR a_user_blocked.blocked_by = :blocked_to AND a_user_blocked.blocked_to = :blocked_by',
        {
          blocked_by: id,
          blocked_to: Number(userId),
        },
      )
      .getCount();

    if (checkBlock !== 0) {
      throw new BadRequestException(
        `You can't send messages. The user blocked by you or you blocked by the user.`,
      );
    }

    const checkChat = await this.chatRepository
      .createQueryBuilder('a_chats')
      .where('a_chats.users @> :users', { users: [id, Number(userId)] })
      .getOne();

    if (checkChat) {
      try {
        await this.sendMessage(user, body, checkChat.id, true);

        return {
          status: 'success',
          message: 'Your greeting message was successfully sent 😊',
        };
      } catch (error) {
        console.log(error);
        throw new BadRequestException(error.message);
      }
    } else {
      const newChat = await this.chatRepository
        .createQueryBuilder('a_chats')
        .insert()
        .into(Chat)
        .values([
          {
            chatName: `${user.name} + ${checkUser.name}`,
            users: [id, Number(userId)],
          },
        ])
        .returning('*')
        .execute()
        .then((response) => response.raw[0]);

      try {
        await this.sendMessage(user, body, newChat.id, true);

        return {
          status: 'success',
          message: 'Your greeting message was successfully sent 😊',
        };
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  async sendTypingStatus(
    user: User,
    body: SendTypingStatusDto,
    chatId: number,
  ): Promise<GlobalResponse> {
    const id: any = user.id;

    if (isNaN(chatId) || chatId < 0) {
      throw new BadRequestException(
        'Please select chat id for send typing status',
      );
    }

    // Check if chat exists and user in chat or not
    const chat = await this.chatRepository
      .createQueryBuilder('a_chats')
      .where('a_chats.id = :chatId', { chatId: Number(chatId) })
      .getOne();

    if (!chat)
      throw new NotFoundException('There is no chat with this credentials');
    else {
      if (chat.users && !chat.users.includes(id)) {
        throw new ConflictException('There is no chat with this credentials');
      }
    }

    const u = chat.users.filter((u) => u !== id);

    if (u.length > 0) {
      const otherUser = await this.userRepository
        .createQueryBuilder('a_users')
        .select('a_users.username')
        .where('a_users.id = :id', {
          id: u[0],
        })
        .getOne();

      if (otherUser) {
        this.pusherService.trigger(otherUser.username, `typing${chatId}`, body);
      }
    }

    return {
      status: 'access',
      message: 'Typing!',
    };
  }

  async deleteChat(user: User, chatId: number): Promise<GlobalResponse> {
    if (user.user_type !== 2) {
      throw new UnprocessableEntityException(
        `You don't have permission to perform this action. Please subscribe one of this plans`,
      );
    }

    const id: any = user.id;
    if (isNaN(chatId) || chatId < 0) {
      throw new BadRequestException('Please select chat for delete');
    }

    // Check if user in chat or not
    const checkChat = await this.chatRepository
      .createQueryBuilder('a_chats')
      .where('a_chats.id = :chatId', { chatId })
      .getOne();

    if (!checkChat)
      throw new NotFoundException('There is no chat with this credentials');
    else {
      if (checkChat.users && !checkChat.users.includes(id)) {
        throw new ConflictException('There is no chat with this credentials');
      }
    }

    this.messageRepository
      .createQueryBuilder('a_messages')
      .delete()
      .where('a_messages.chat = :chatId', {
        chatId: Number(chatId),
      })
      .execute();

    this.awsService.deleteChat(chatId);

    return {
      status: 'success',
      message: `Chat was successfully deleted`,
    };
  }
}
