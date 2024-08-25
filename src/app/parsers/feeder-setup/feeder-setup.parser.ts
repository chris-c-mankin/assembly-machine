import { FeederConfigurationLineDto } from "../../dtos/feeder-configuration-line.dto";
import * as Papa from "papaparse";

export class FeederSetupParser {
  static Parse(csv: string): FeederConfigurationLineDto[] {
    const headers =
      "Type,Number,Part Number,Description,Qty,SKU,Place Height,Nozzle";
    const headerLineNumber = csv
      .split("\n")
      .findIndex((line) => line.includes(headers));
    const csvWithoutHeaderLines = csv
      .split("\n")
      .slice(headerLineNumber)
      .join("\n");
    const result = Papa.parse<FeederConfigurationLineDto>(
      csvWithoutHeaderLines,
      {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: "greedy",
        transformHeader(header) {
          switch (header) {
            case "Type":
              return "type";
            case "Number":
              return "number";
            case "Part Number":
              return "partNumber";
            case "Description":
              return "description";
            case "Qty":
              return "quantity";
            case "SKU":
              return "sku";
            case "Place Height":
              return "placeHeight";
            case "Nozzle":
              return "nozzle";
            default:
              return header;
          }
        },
        transform: (value, header) => {
          if (header === "quantity" && value === "NOT FOUND") {
            return 0;
          }
          if (header === "placeHeight" && value === "NO MATCH") {
            return null;
          }
          return value;
        }
      }
    );
    return result.data.map((row) => {
      const dto = new FeederConfigurationLineDto();
      dto.type = row.type;
      dto.number = row.number;
      dto.partNumber = row.partNumber;
      dto.description = row.description;
      dto.quantity = row.quantity;
      dto.sku = row.sku;
      dto.placeHeight = row.placeHeight;
      dto.nozzle = row.nozzle;
      return dto;
    });
  }
}
