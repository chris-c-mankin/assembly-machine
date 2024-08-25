import * as fs from "fs";
import * as path from "path";
import { AssemblyFileParser } from "./assembly-file.parser";

describe("AssemblyFileParser", () => {
  let sampleCsv: string;

  beforeAll(() => {
    const csvFilePath = path.resolve(__dirname, '__mocks__/assembly-file-mini.mock.csv');
    sampleCsv = fs.readFileSync(csvFilePath, "utf8");
  });

  describe("Parse", () => {
    it("should return an array of AssemblyOperationDto", () => {
      // Arrange
      const expected = [
        {
          comment: "4.7k",
          designator: "R12",
          footprint: "RES_0805_N",
          layer: "T",
          midpointPositionX: 7.112,
          midpointPositionY: 12.258,
          padPositionX: 7.112,
          padPositionY: 13.208,
          referencePositionX: 7.112,
          referencePositionY: 12.258,
          rotation: 270,
        },
        {
          comment: "4.7k",
          designator: "R5",
          footprint: "RES_0805_N",
          layer: "T",
          midpointPositionX: 6.096,
          midpointPositionY: 0.508,
          padPositionX: 7.046,
          padPositionY: 0.508,
          referencePositionX: 6.096,
          referencePositionY: 0.508,
          rotation: 180,
        },
        {
          comment: "100k",
          designator: "R21",
          footprint: "RES_0603_N",
          layer: "T",
          midpointPositionX: 17.526,
          midpointPositionY: 8.374,
          padPositionX: 17.526,
          padPositionY: 7.574,
          referencePositionX: 17.526,
          referencePositionY: 8.374,
          rotation: 90,
        },
        {
          comment: "10k",
          designator: "R20",
          footprint: "RES_0603_N",
          layer: "T",
          midpointPositionX: 22.86,
          midpointPositionY: 9.906,
          padPositionX: 22.86,
          padPositionY: 9.106,
          referencePositionX: 22.86,
          referencePositionY: 9.906,
          rotation: 90,
        },
        {
          comment: "100k",
          designator: "R19",
          footprint: "RES_0603_N",
          layer: "T",
          midpointPositionX: 28.194,
          midpointPositionY: 25.654,
          padPositionX: 28.194,
          padPositionY: 24.854,
          referencePositionX: 28.194,
          referencePositionY: 25.654,
          rotation: 90,
        },
      ];

      // Act
      const result = AssemblyFileParser.Parse(sampleCsv);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});
