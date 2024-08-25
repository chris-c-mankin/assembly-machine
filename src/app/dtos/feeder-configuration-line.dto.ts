import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class FeederConfigurationLineDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsNumber()
  @IsNotEmpty()
  partNumber: number | null;

  @IsString()
  @IsNotEmpty()
  description: string | null;
 
  @IsNumber()
  @IsNotEmpty()
  quantity: number | null;

  @IsString()
  @IsNotEmpty()
  sku: string | null;

  @IsNumber()
  @IsNotEmpty()
  placeHeight: number | null;

  @IsNumber()
  @IsNotEmpty()
  nozzle: number | null;
}
