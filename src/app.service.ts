import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { creatMahasiswaDTO } from './dto/create-mahasiswa.dto';
import prisma from './prisma';
import { RegisterUserDto } from './dto/register-user.dto';
import { hashSync, compareSync } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { extname } from 'path';
import { updatemahasiswaDTO } from './dto/update-mahasiswa.dto';
import { User } from './entity/user.entity';

@Injectable()
export class AppService {
  constructor(private readonly jwtService: JwtService) {}

  async uploadMahasiswaFoto(file: Express.Multer.File, nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({ where: { nim } });
    if (!mahasiswa) throw new NotFoundException('Mahasiswa Tidak Ditemukan');

    if (mahasiswa.foto_profile) {
      const filePath = `../../uploads/${mahasiswa.foto_profile}`;
      if (existsSync(filePath)) {
        rmSync(filePath);
      }
    }

    const uploadPath = `../../uploads/`;
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }

    const fileExt = extname(file.originalname);
    const baseFilename = mahasiswa.nim;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${baseFilename}-${uniqueSuffix}${fileExt}`;
    const filePath = `${uploadPath}${filename}`;

    writeFileSync(filePath, file.buffer);
    await prisma.mahasiswa.update({
      where: { nim },
      data: { foto_profile: filename },
    });

    return filename;
  }

  async getMahasiwaFoto(nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({ where: { nim } });
    if (!mahasiswa) throw new NotFoundException('Mahasiswa Tidak Ditemukan');
    return mahasiswa.foto_profile;
  }

  async register(data: RegisterUserDto) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: data.username,
        },
      });
      if (user != null) throw new BadRequestException('Username Sudah Ada');

      const hash = hashSync(data.Password, 10);
      const newUser = await prisma.user.create({
        data: {
          username: data.username,
          password: hash,
          role: "user", 
        },
      });
      return newUser;
    } catch (err) {
      throw new InternalServerErrorException('Ada Masalah Pada Server');
    }
  }

  async auth(user_id: number) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: user_id,
        },
      });
      if (user == null) throw new NotFoundException('User Tidak Ditemukan');
      return user;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Terdapat Masalah Dari Server Harap Coba Lagi dalam beberapa menit');
    }
  }

  async login(data: LoginUserDto) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: data.username,
        },
      });
      if (user == null) throw new NotFoundException('Username Tidak Ditemukan');

      const isPasswordValid = compareSync(data.Password, user.password);
      if (!isPasswordValid) throw new BadRequestException('Password Salah');

      const payload = {
        id: user.id,
        username: user.username,
        role: user.role, // Pastikan role ada di payload
      };
      const token = await this.jwtService.signAsync(payload);
      return {
        token: token,
        user,
      };
    } catch (err) {
      throw new InternalServerErrorException('Ada Masalah Pada Server');
    }
  }

  async getMahasiswa() {
    return await prisma.mahasiswa.findMany();
  }

  async getMahasiswaByNIM(nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        nim,
      },
    });

    if (mahasiswa == null) throw new NotFoundException('Tidak Menemukan NIM');

    return mahasiswa;
  }

  async addMahasiswa(data: creatMahasiswaDTO) {
    await prisma.mahasiswa.create({
      data,
    });

    return await prisma.mahasiswa.findMany();
  }

  async deleteMahasiswa(nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        nim,
      },
    });

    if (mahasiswa == null) {
      throw new NotFoundException('Tidak Menemukan NIM');
    }

    await prisma.mahasiswa.delete({
      where: {
        nim,
      },
    });

    return await prisma.mahasiswa.findMany();
  }

  async updateMahasiswa(nim: string, data: updatemahasiswaDTO) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: {
        nim,
      },
    });
  
    if (mahasiswa == null) {
      throw new NotFoundException('Tidak Menemukan NIM');
    }
  
    await prisma.mahasiswa.update({
      where: {
        nim,
      },
      data: {
        nama: data.nama,
        kelas: data.kelas,
        jurusan: data.jurusan,
        jenis_kelamin: data.jenis_kelamin,
        foto_profile: data.foto_profile,
      },
    });
  
    return await prisma.mahasiswa.findMany();
  }
}