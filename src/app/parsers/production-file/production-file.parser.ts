import {
  Operation,
  ProductionFile,
  ProductionOperation,
} from "../../models/production-file.model";
import * as Papa from "papaparse";

export class ProductionFileParser {
  private static OperationHeaders = [
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

  private static ManualOperationHeaders = [
    "Designator",
    "Comment",
    "Footprint",
    "Mid X(mm)",
    "Midpoint Y(mm)",
    "Rotation",
    "Head",
  ];

  static Serialize<T extends Operation>(operations: T[]) {
    const headers = this.IsOperationsList(operations)
      ? this.OperationHeaders
      : this.ManualOperationHeaders;

    const rows = operations.map((operation) => {
      return this.ExtractValues(operation);
    });

    const csv = Papa.unparse({
      fields: headers,
      data: rows,
    });
    return csv;
  }

  private static ExtractValues<T extends Operation>(operation: T) {
    if (operation instanceof ProductionOperation) {
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
    } else {
      return [
        operation.designator,
        operation.comment,
        operation.footprint,
        operation.midpointPositionX,
        operation.midpointPositionY,
        operation.rotation,
        operation.head,
      ];
    }
  }

  private static IsOperationsList(
    operations: any[]
  ): operations is ProductionOperation[] {
    return operations[0] instanceof ProductionOperation;
  }
}
