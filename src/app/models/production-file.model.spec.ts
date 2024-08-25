import * as fs from "fs";
import * as path from "path";
import { AssemblyFile } from "./assembly-file.model";
import { BillOfMaterials } from "./bill-of-materials.model";
import { FeederSetup } from "./feeder-setup.model";
import { BillOfMaterialsParser } from "../parsers/bill-of-materials/bill-of-materials.parser";
import { AssemblyFileParser } from "../parsers/assembly-file/assembly-file.parser";
import { FeederSetupParser } from "../parsers/feeder-setup/feeder-setup.parser";
import { ProductionFile } from "./production-file.model";

describe("ProductionFile", () => {
  let billOfMaterials: BillOfMaterials;
  let assemblyFile: AssemblyFile;
  let feederSetup: FeederSetup;

  beforeEach(() => {
    const billOfMaterialsCsvFilePath = path.resolve(
      __dirname,
      "../parsers/bill-of-materials/__mocks__/bill-of-materials-mapped.mock.csv"
    );
    const billOfMaterialsCsv = fs.readFileSync(
      billOfMaterialsCsvFilePath,
      "utf8"
    );

    const assemblyFileCsvFilePath = path.resolve(
      __dirname,
      "../parsers/assembly-file/__mocks__/assembly-file-mapped.mock.csv"
    );
    const assemblyFileCsv = fs.readFileSync(assemblyFileCsvFilePath, "utf8");

    const feederSetupCsvFilePath = path.resolve(
      __dirname,
      "../parsers/feeder-setup/__mocks__/feeder-setup-mapped.mock.csv"
    );
    const feederSetupCsv = fs.readFileSync(feederSetupCsvFilePath, "utf8");

    const billOfMaterialsDtos = BillOfMaterialsParser.Parse(billOfMaterialsCsv);
    billOfMaterials = new BillOfMaterials(billOfMaterialsDtos);

    const assemblyFileDtos = AssemblyFileParser.Parse(assemblyFileCsv);
    assemblyFile = new AssemblyFile(assemblyFileDtos);

    const feederSetupDtos = FeederSetupParser.Parse(feederSetupCsv);
    feederSetup = new FeederSetup(feederSetupDtos);
  });

  describe("generateOperations", () => {
    it("should generate a map of ProductionOperation", () => {
      // Arrange
      const productionFile = new ProductionFile();

      // Act
      productionFile.generateOperations(
        billOfMaterials,
        assemblyFile,
        feederSetup
      );

      // Assert
      const operations = productionFile["operations"];
      expect(operations.size).toBe(assemblyFile.operations.size);

      const sample1 = operations.get("R15");
      expect(sample1?.comment).toBe("RES-171");
      expect(sample1?.feederNumber).toBe(15);
      expect(sample1?.placeHeightMm).toBe(0.5);

      const sample2 = operations.get("R16");
      expect(sample2?.comment).toBe("RES-171");
      expect(sample2?.feederNumber).toBe(15);
      expect(sample2?.placeHeightMm).toBe(0.5);

      const sample3 = operations.get("R19");
      expect(sample3?.comment).toBe("RES-171");
      expect(sample3?.feederNumber).toBe(15);
      expect(sample3?.placeHeightMm).toBe(0.5);

      const sample4 = operations.get("C15");
      expect(sample4?.comment).toBe("CAP-573");
      expect(sample4?.feederNumber).toBe(5);
      expect(sample4?.placeHeightMm).toBe(0.5);

      const sample5 = operations.get("C7");
      expect(sample5?.comment).toBe("CAP-573");
      expect(sample5?.feederNumber).toBe(5);
      expect(sample5?.placeHeightMm).toBe(0.5);

      const sample6 = operations.get("C9");
      expect(sample6?.comment).toBe("CAP-573");
      expect(sample6?.feederNumber).toBe(5);
      expect(sample6?.placeHeightMm).toBe(0.5);

      const sample7 = operations.get("C1");
      expect(sample7?.comment).toBe("CAP-84");
      expect(sample7?.feederNumber).toBe(9);
      expect(sample7?.placeHeightMm).toBe(0.8);

      const sample8 = operations.get("C16");
      expect(sample8?.comment).toBe("CAP-84");
      expect(sample8?.feederNumber).toBe(9);
      expect(sample8?.placeHeightMm).toBe(0.8);

      const sample9 = operations.get("C2");
      expect(sample9?.comment).toBe("CAP-84");
      expect(sample9?.feederNumber).toBe(9);
      expect(sample9?.placeHeightMm).toBe(0.8);
    });
  });

  describe("getOperations", () => {
    it("should return a sorted array of ProductionOperation", () => {
      // Arrange
      const productionFile = new ProductionFile();
      productionFile.generateOperations(
        billOfMaterials,
        assemblyFile,
        feederSetup
      );

      // Act
      const operations = productionFile.getOperations();

      // Assert
      expect(operations.length).toBe(assemblyFile.operations.size);

      const designators = operations.map((operation) => operation.designator);
      expect(designators).toEqual([
        "R15",
        "R16",
        "R19",
        "C1",
        "C2",
        "C16",
        "C7",
        "C9",
        "C15",
      ]);
    });
  });
});
