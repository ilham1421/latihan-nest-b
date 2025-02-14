import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  message: string;

  @IsNotEmpty()
  @IsString()
  sender: string;
}
