import { ApiProperty } from "@nestjs/swagger";

export class MigrateCartDto {
    @ApiProperty({ 
        description: 'ID temporal del usuario no autenticado', 
        example: 'temp123' 
    })
    temporaryUserId: string;
}