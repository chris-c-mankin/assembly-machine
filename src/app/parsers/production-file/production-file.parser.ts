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
    "Mid Y(mm)",
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
    "Mid Y(mm)",
    "Rotation",
    "Head",
  ];

  static Parse(csv: string): ProductionOperation[] {
    const headers =
      "Designator,Comment,Footprint,Mid X(mm),Mid Y(mm),Rotation,Head,FeederNo,Mount Speed(%),Pick Height(mm),Place Height(mm),Mode,Skip";
    const headerLineNumber = csv.split("\n").findIndex((line) =>
      line
        .split(",")
        .map((cell) => cell.trim())
        .join(",")
        .includes(headers)
    );
    const csvWithoutHeaderLines = csv
      .split("\n")
      .slice(headerLineNumber)
      .join("\n");
    const result = Papa.parse<ProductionOperation>(csvWithoutHeaderLines, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: "greedy",
      transformHeader(header) {
        switch (header.trim()) {
          case "Designator":
            return "designator";
          case "Comment":
            return "comment";
          case "Footprint":
            return "footprint";
          case "Mid X(mm)":
            return "midpointPositionX";
          case "Mid Y(mm)":
            return "midpointPositionY";
          case "Rotation":
            return "rotation";
          case "Head":
            return "head";
          case "FeederNo":
            return "feederNumber";
          case "Mount Speed(%)":
            return "mountSpeedPercentage";
          case "Pick Height(mm)":
            return "pickHeightMm";
          case "Place Height(mm)":
            return "placeHeightMm";
          case "Mode":
            return "mode";
          case "Skip":
            return "skip";
          default:
            return header;
        }
      },
    });

    return result.data.map((row) => {
      const operation = new ProductionOperation();
      operation.designator = row.designator;
      operation.comment = row.comment;
      operation.footprint = row.footprint;
      operation.midpointPositionX = row.midpointPositionX;
      operation.midpointPositionY = row.midpointPositionY;
      operation.rotation = row.rotation;
      operation.head = row.head;
      operation.feederNumber = row.feederNumber;
      operation.mountSpeedPercentage = row.mountSpeedPercentage;
      operation.pickHeightMm = row.pickHeightMm;
      operation.placeHeightMm = row.placeHeightMm;
      operation.mode = row.mode;
      operation.skip = row.skip;
      return operation;
    });
  }

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
