import { Controller, Get, Post, Body, Delete, Param, Put, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express'; 

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('mahasiswa/:nim/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMahasiswaFoto(@UploadedFile() file: Express.Multer.File, @Param('nim') nim: string) {
    if (!file) throw new BadRequestException('File tidak boleh kosong');
    return this.appService.uploadMahasiswaFoto(file, nim);
  }

  @Get('mahasiswa/:nim/foto')
  async getMahasiswaFoto(@Param('nim') nim: string, @Res() res: Response) {
    const filename = await this.appService.getMahasiwaFoto(nim);
    return res.sendFile(filename, { root: 'uploads' });
  }

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
    return user;
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
  editMahasiswa(@Param('nim') nim: string, @Body() data: updatemahasiswaDTO) {
  return this.appService.updateMahasiswa(nim, data);
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