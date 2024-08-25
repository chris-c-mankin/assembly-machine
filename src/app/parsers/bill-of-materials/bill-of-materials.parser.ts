import * as Papa from "papaparse";
import { BillOfMaterialsComponentDto } from "../../dtos/bill-of-materials-component.dto";

export class BillOfMaterialsParser {
  static Parse(csv: string): BillOfMaterialsComponentDto[] {
    const result = Papa.parse<BillOfMaterialsComponentDto>(csv, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: "greedy",
      transformHeader(header) {
        switch (header) {
          case "Designator":
            return "designator";
          case "Description":
            return "description";
          case "Quantity":
            return "quantity";
          case "SKU":
            return "sku";
          case "Comment":
            return "comment";
          default:
            return header;
        }
      },
    });
    return result.data.map((row) => {
      const dto = new BillOfMaterialsComponentDto();
      dto.comment = row.comment;
      dto.description = row.description;
      dto.quantity = row.quantity;
      dto.sku = row.sku;
      dto.designator = row.designator;
      return dto;
    });
  }
}
