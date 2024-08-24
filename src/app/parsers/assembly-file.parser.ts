import { AssemblyOperationDto } from "../dtos/assembly-operation.dto";
import * as Papa from "papaparse";

export class AssemblyFileParser {
  static Parse(csv: string): AssemblyOperationDto[] {
    const result = Papa.parse<AssemblyOperationDto>(csv, { header: true, dynamicTyping: true });
    return result.data.map((row) => {
      const dto = new AssemblyOperationDto();
      dto.comment = row.comment;
      dto.designator = row.designator;
      dto.footprint = row.footprint;
      dto.layer = row.layer;
      dto.midpointPositionX = row.midpointPositionX;
      dto.midpointPositionY = row.midpointPositionY;
      dto.padPositionX = row.padPositionX;
      dto.padPositionY = row.padPositionY;
      dto.referencePositionX = row.referencePositionX;
      dto.referencePositionY = row.referencePositionY;
      dto.rotation = row.rotation;
      return dto;
    });
  }
}