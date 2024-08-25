import * as fs from "fs";
import * as path from "path";
import { BillOfMaterialsParser } from "./bill-of-materials.parser";

describe("BillOfMaterialsParser", () => {
  let sampleCsv: string;

  beforeAll(() => {
    const csvFilePath = path.resolve(
      __dirname,
      "__mocks__/bill-of-materials-mini.mock.csv"
    );
    sampleCsv = fs.readFileSync(csvFilePath, "utf8");
  });

  describe("Parse", () => {
    it("should return an array of BillOfMaterialsComponentDto", () => {
      // Arrange
      const expected = [
        {
          comment: "Board Label",
          description: "Board Label",
          quantity: 1,
          sku: "BRD-063-2A",
          designator: "Label1",
        },
        {
          comment: "100p",
          description: "100p 50v 5% COG 0603",
          quantity: 1,
          sku: "CAP-84",
          designator: "C1",
        },
        {
          comment:
        "MMS-104-01-T-SV",
          description: "Tiger Claw(TM) Socket Strip, Through-hole, Vertical, -55 to 105 degC, 2 mm Pitch, 4-Pin, Female, RoHS",
          quantity: 1,
          sku: "CON-J018",
          designator: "CN3",
        },
        {
          comment: "0ZCH0020FF2E",
          description: "POLYSWITCH 0.20A 30V RESET FUSE SMD",
          quantity: 1,
          sku: "FUS-315",
          designator: "F3",
        },
        {
          comment: "LTST-C190KRKT",
          description: "LED - SMD Red Clear 631nm 0603",
          quantity: 1,
          sku: "OPT-504",
          designator: "LED1",
        },
      ];

      // Act
      const result = BillOfMaterialsParser.Parse(sampleCsv);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});
