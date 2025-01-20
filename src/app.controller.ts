import { Controller, Get, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody } from '@nestjs/swagger';
import { creatMahasiswaDTO } from './dto/create-mahasiswa.dto';
import { updatemahasiswaDTO } from './dto/update-mahasiswa.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './auth.guards';
import { UserDecorator } from './user.decorator';
import { User } from './entity/user.entity';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  @ApiBody({
    type: RegisterUserDto
  })
  register(@Body() data: RegisterUserDto) {
    return this.appService.register(data);
  }

  @Get("/auth")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  auth(@UserDecorator() user : User) {
    return user
  }

  @Post('login')
  @ApiBody({
    type: LoginUserDto
  })
  login(@Body() data: LoginUserDto) {
    return this.appService.login(data);
  }

  @Post('mahasiswa')
  @ApiBody({ type: creatMahasiswaDTO })
  createMahasiswa(@Body() data: creatMahasiswaDTO) {
    return this.appService.addMahasiswa(data);
  }

  @Delete('mahasiswa/:nim')
  deleteMahasiswa(@Param('nim') nim: string) {
    return this.appService.deleteMahasiswa(nim);
  }

  @Put('mahasiswa/:nim')
  @ApiBody({ type: updatemahasiswaDTO })
  editMahasiswa(@Param('nim') nim: string) {
    return this.appService.editMahasiswa(nim);
  }

  @Get('mahasiswa')
  getMahasiswa() {
    return this.appService.getMahasiswa();
  }

  @Get('mahasiswa/:nim')
  getMahasiswaByNim(@Param('nim') nim: string) {
    return this.appService.getMahasiswaByNIM(nim);
  }
}