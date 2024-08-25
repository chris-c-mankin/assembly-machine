import * as fs from "fs";
import * as path from "path";
import { FeederSetupParser } from "./feeder-setup.parser";

describe("FeederSetupParser", () => {
  let sampleCsv: string;

  beforeAll(() => {
    const csvFilePath = path.resolve(
      __dirname,
      "__mocks__/feeder-setup-mini.mock.csv"
    );
    sampleCsv = fs.readFileSync(csvFilePath, "utf8");
  });

  describe("Parse", () => {
    it("should return an array of FeederConfigurationLineDto", () => {
      // Arrange
      // Neoden P&P Setup,,,,,,,
      // ,,,,,,,
      // Parts loaded on machine:,,,,,,,
      // Feeder,,,,,,,
      // Type,Number,Part Number,Description,Qty,SKU,Place Height,Nozzle
      // Tape,1,,,473,RES-J002,0.5,40
      // Tape,2,,,771,RES-J001,0.5,40
      // Tape,20,,,NOT FOUND,,NO MATCH,
      // Tape,21,,,10,SEM-J045,0.5,140
      // Tape,22,,,NOT FOUND,,NO MATCH,

      const expected = [
        {
          type: "Tape",
          number: 1,
          partNumber: null,
          description: null,
          quantity: 473,
          sku: "RES-J002",
          placeHeight: 0.5,
          nozzle: 40,
        },
        {
          type: "Tape",
          number: 2,
          partNumber: null,
          description: null,
          quantity: 771,
          sku: "RES-J001",
          placeHeight: 0.5,
          nozzle: 40,
        },
        {
          type: "Tape",
          number: 20,
          partNumber: null,
          description: null,
          quantity: 0,
          sku: null,
          placeHeight: null,
          nozzle: null,
        },
        {
          type: "Tape",
          number: 21,
          partNumber: null,
          description: null,
          quantity: 10,
          sku: "SEM-J045",
          placeHeight: 0.5,
          nozzle: 140,
        },
        {
          type: "Tape",
          number: 22,
          partNumber: null,
          description: null,
          quantity: 0,
          sku: null,
          placeHeight: null,
          nozzle: null,
        },
      ];

      // Act
      const result = FeederSetupParser.Parse(sampleCsv);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});
