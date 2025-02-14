import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server } from 'socket.io';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatService {
  @WebSocketServer()
  server: Server;

  private chats: {
    id: number;
    message: string;
    sender: string;
    timestamp: Date;
  }[] = [];
  private idCounter = 1;

  create(createChatDto: CreateChatDto) {
    try {
      const newChat = {
        id: this.idCounter++,
        ...createChatDto,
        timestamp: new Date(),
      };
      this.chats.push(newChat);
      this.server.emit('chat message', newChat);
      return newChat;
    } catch (error) {
      throw new Error(`Failed to create chat: ${error.message}`);
    }
  }

  findAll() {
    try {
      return this.chats;
    } catch (error) {
      throw new Error(`Failed to fetch chats: ${error.message}`);
    }
  }

  findOne(id: number) {
    try {
      const chat = this.chats.find((chat) => chat.id === id);
      if (!chat) {
        throw new NotFoundException(`Chat with ID ${id} not found`);
      }
      return chat;
    } catch (error) {
      throw new Error(`Failed to fetch chat: ${error.message}`);
    }
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    try {
      const chatIndex = this.chats.findIndex((chat) => chat.id === id);
      if (chatIndex === -1) {
        throw new NotFoundException(`Chat with ID ${id} not found`);
      }

      this.chats[chatIndex] = {
        ...this.chats[chatIndex],
        ...updateChatDto,
        timestamp: new Date(),
      };

      this.server.emit('chat updated', this.chats[chatIndex]);
      return this.chats[chatIndex];
    } catch (error) {
      throw new Error(`Failed to update chat: ${error.message}`);
    }
  }

  remove(id: number) {
    try {
      const chatIndex = this.chats.findIndex((chat) => chat.id === id);
      if (chatIndex === -1) {
        throw new NotFoundException(`Chat with ID ${id} not found`);
      }

      const removedChat = this.chats.splice(chatIndex, 1)[0];
      this.server.emit('chat deleted', id);
      return removedChat;
    } catch (error) {
      throw new Error(`Failed to delete chat: ${error.message}`);
    }
  }

  handleMessage(client: any, payload: CreateChatDto) {
    try {
      return this.create(payload);
    } catch (error) {
      throw new Error(`Failed to handle message: ${error.message}`);
    }
  }
}
