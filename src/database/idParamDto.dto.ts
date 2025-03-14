import { IsUUID } from "class-validator";

export class idParamDto {
    @IsUUID()
    id: string;
}