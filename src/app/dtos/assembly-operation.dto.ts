import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AssemblyOperationDto {
  @IsString()
  @IsNotEmpty()
  designator: string;

  @IsString()
  @IsNotEmpty()
  footprint: string;

  @IsNumber()
  @IsNotEmpty()
  midpointPositionX: number;

  @IsNumber()
  @IsNotEmpty()
  midpointPositionY: number;

  @IsNumber()
  @IsNotEmpty()
  referencePositionX: number;

  @IsNumber()
  @IsNotEmpty()
  referencePositionY: number;

  @IsNumber()
  @IsNotEmpty()
  padPositionX: number;

  @IsNumber()
  @IsNotEmpty()
  padPositionY: number;

  @IsString()
  @IsNotEmpty()
  layer: string;

  @IsNumber()
  @IsNotEmpty()
  rotation: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
