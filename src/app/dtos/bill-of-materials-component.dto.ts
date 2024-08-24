import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class BillOfMaterialsComponentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  designator: string;
}
