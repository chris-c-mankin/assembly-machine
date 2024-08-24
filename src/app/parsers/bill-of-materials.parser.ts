import * as Papa from "papaparse";
import { BillOfMaterialsComponentDto } from "../dtos/bill-of-materials-component.dto";

export class BillOfMaterialsParser {
  static Parse(csv: string): BillOfMaterialsComponentDto[] {
    const result = Papa.parse<BillOfMaterialsComponentDto>(csv, { header: true, dynamicTyping: true });
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
