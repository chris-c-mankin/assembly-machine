import { AssemblyOperationDto } from "../../dtos/assembly-operation.dto";
import * as Papa from "papaparse";

export class AssemblyFileParser {
  static Parse(csv: string): AssemblyOperationDto[] {
    const result = Papa.parse<AssemblyOperationDto>(csv, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: "greedy",
      transformHeader(header) {
        switch (header) {
          case "Designator":
            return "designator";
          case "Footprint":
            return "footprint";
          case "Mid X":
            return "midpointPositionX";
          case "Mid Y":
            return "midpointPositionY";
          case "Ref X":
            return "referencePositionX";
          case "Ref Y":
            return "referencePositionY";
          case "Pad X":
            return "padPositionX";
          case "Pad Y":
            return "padPositionY";
          case "Layer":
            return "layer";
          case "Rotation":
            return "rotation";
          case "Comment":
            return "comment";
          default:
            return header;
        }
      },
      transform(value, header) {
        if (typeof header === "string" &&
          [
            "midpointPositionX",
            "midpointPositionY",
            "referencePositionX",
            "referencePositionY",
            "padPositionX",
            "padPositionY",
          ].includes(header)
        ) {
          // Remove the "mm" suffix and parse as float
          return parseFloat(value.replace("mm", ""));
        }
        return value;
      },
    });
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
