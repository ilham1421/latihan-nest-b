import { ApiProperty } from "@nestjs/swagger";
import { Jenis_Kelamin } from "@prisma/client";
import { IsString, IsNotEmpty, Length, IsEnum } from "class-validator";

export class creatMahasiswaDTO {

    @ApiProperty({description : "Nim", 
        type : String,
        example : "105841105422"
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 12)
    nim : string;

    @ApiProperty({description : "Nama", 
        type : String,
        example : "ALYA ANANDHA"
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
        example : "P"
    })
    @IsEnum(Jenis_Kelamin)
    jenis_kelamin : Jenis_Kelamin;

}
