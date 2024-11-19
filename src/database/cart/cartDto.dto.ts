import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class cartDto {
    @IsArray()
    @IsNotEmpty()
    products: string[];
}
