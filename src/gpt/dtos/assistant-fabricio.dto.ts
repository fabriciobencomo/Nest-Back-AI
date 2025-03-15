import { IsString } from "class-validator";

export class assistantFabricioDto {

  @IsString()
  readonly prompt: string;
  
}

