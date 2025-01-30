import { ApiProperty } from "@nestjs/swagger";
import { Jenis_Kelamin } from "@prisma/client";
import { IsString, IsNotEmpty, Length, IsEnum, IsOptional } from "class-validator";


export class updatemahasiswaDTO {

    @ApiProperty({description : "Foto Profile",
        type : String,
        example : "http://localhost:3000/uploads/105841105822.jpg"})
    @IsString() 
    @IsOptional()
    foto_profile? : string;

    @ApiProperty({description : "Nim", 
        type : String,
        example : "105841105822"
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 12)
    nim : string;

    @ApiProperty({description : "Nama", 
        type : String,
        example : "Muh. Ilham Akbar"
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    nama : string;

    @ApiProperty({description : "kelas", 
        type : String,
        example : "5B"
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    kelas : string;

    @ApiProperty({description : "jurusan", 
        type : String,
        example : "INFORMATIKA"
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    jurusan : string;

    @ApiProperty({
        description : "Jenis Kelamin", 
        enum : Jenis_Kelamin,
        example : "L"
    })
    @IsEnum(Jenis_Kelamin)
    jenis_kelamin : Jenis_Kelamin;

}