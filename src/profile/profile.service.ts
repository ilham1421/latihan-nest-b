import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, rmSync, writeFileSync } from 'fs';
import path, { extname } from 'path';
import { mkdirSync } from 'fs';
import prisma from 'src/prisma';
@Injectable()
export class ProfileService {
    async uploadFile(file: Express.Multer.File, user_id : number)
    {
    const user =await
    prisma.user.findFirst({
            where:{
                id : user_id
            }
        })
        if(user == null) throw new
    NotFoundException("Tidak Menemukan User")   
        if (user.foto_profile != null){
            const filePath =
    `../../uploads/${user.foto_profile}`;
            if(existsSync(filePath)){
                rmSync(filePath)
            }
        }
        const uploadPath = `../../uploads/`;
            if (!existsSync(uploadPath)){
                mkdirSync(uploadPath);
            }

            const fileExt = extname(file.originalname);
            const baseFilename = user.username;
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = `${baseFilename}-${uniqueSuffix}${fileExt}`;
            const filePath = `${uploadPath}/${filename}`;

        writeFileSync(filePath, file.buffer);
        await prisma.user.update({
            where:{
                id : user_id
            },
            data:{
                foto_profile : filename
            }
        })

        return {filename, path: filePath}
    }
        async sendMyFotoProfile(user_id: number) {
            const user = await prisma.user.findFirst({
                where: {
                    id: user_id
                }
            });
    
            if (user == null) throw new NotFoundException("User Tidak Ditemukan");
            return user.foto_profile;
        }
    
    }
    
