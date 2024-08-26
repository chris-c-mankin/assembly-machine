import { ProductionFile } from "../../models/production-file.model";
import * as Papa from "papaparse";

export class ProductionFileParser {
  static Serialize(productionFile: ProductionFile) {
    
    const headers = [
      "Designator",
      "Comment",
      "Footprint",
      "Mid X(mm)",
      "Midpoint Y(mm)",
      "Rotation",
      "Head",
      "FeederNo",
      "Mount Speed(%)",
      "Pick Height(mm)",
      "Place Height(mm)",
      "Mode",
      "Skip",
    ];
    const rows = productionFile.getOperations().map((operation) => {
      return [
        operation.designator,
        operation.comment,
        operation.footprint,
        operation.midpointPositionX,
        operation.midpointPositionY,
        operation.rotation,
        operation.head,
        operation.feederNumber,
        operation.mountSpeedPercentage,
        operation.pickHeightMm,
        operation.placeHeightMm,
        operation.mode,
        operation.skip,
      ];
    });
    const csv = Papa.unparse({
      fields: headers,
      data: rows,
    });
    return csv;
  }
}
