import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class FeederConfigurationLineDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsNumber()
  @IsOptional()
  partNumber?: number;

  @IsString()
  @IsOptional()
  description?: string;
 
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @IsOptional()
  placeHeight?: number;

  @IsNumber()
  @IsOptional()
  nozzle?: number;
}
