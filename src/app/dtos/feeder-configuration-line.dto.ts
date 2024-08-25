import { IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";

export class FeederConfigurationLineDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsNotEmpty()
  number: number;

  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  partNumber: number | null;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  description: string | null;
 
  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  quantity: number | null;

  @IsString()
  @ValidateIf((object, value) => value !== null)
  sku: string | null;

  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  placeHeight: number | null;

  @IsNumber()
  @ValidateIf((object, value) => value !== null)
  nozzle: number | null;
}
