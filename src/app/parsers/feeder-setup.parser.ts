import { FeederConfigurationLineDto } from "../dtos/feeder-configuration-line.dto";
import * as Papa from "papaparse";

export class FeederSetupParser {
  static Parse(csv: string): FeederConfigurationLineDto[] {
    const result = Papa.parse<FeederConfigurationLineDto>(csv, {
      header: true,
      dynamicTyping: true,
    });
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
