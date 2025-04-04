import * as fs from "fs";
import * as path from "path";
import { AssemblyFile } from "./assembly-file.model";
import { BillOfMaterials } from "./bill-of-materials.model";
import { FeederSetup } from "./feeder-setup.model";
import { BillOfMaterialsParser } from "../parsers/bill-of-materials/bill-of-materials.parser";
import { AssemblyFileParser } from "../parsers/assembly-file/assembly-file.parser";
import { FeederSetupParser } from "../parsers/feeder-setup/feeder-setup.parser";
import { ProductionFile, ProductionOperation } from "./production-file.model";
import { ProductionFileParser } from "../parsers/production-file/production-file.parser";

describe("ProductionFile", () => {
  let billOfMaterials: BillOfMaterials;
  let assemblyFile: AssemblyFile;
  let feederSetup: FeederSetup;
  let sampleProductionFile: ProductionFile;

  beforeEach(() => {
    const billOfMaterialsCsvFilePath = path.resolve(
      __dirname,
      "../parsers/bill-of-materials/__mocks__/bill-of-materials-sample.mock.csv"
    );
    const billOfMaterialsCsv = fs.readFileSync(
      billOfMaterialsCsvFilePath,
      "utf8"
    );

    const assemblyFileCsvFilePath = path.resolve(
      __dirname,
      "../parsers/assembly-file/__mocks__/assembly-file-sample.mock.csv"
    );
    const assemblyFileCsv = fs.readFileSync(assemblyFileCsvFilePath, "utf8");

    const feederSetupCsvFilePath = path.resolve(
      __dirname,
      "../parsers/feeder-setup/__mocks__/feeder-setup-sample.mock.csv"
    );
    const feederSetupCsv = fs.readFileSync(feederSetupCsvFilePath, "utf8");

    const billOfMaterialsDtos = BillOfMaterialsParser.Parse(billOfMaterialsCsv);
    billOfMaterials = new BillOfMaterials(billOfMaterialsDtos);

    const assemblyFileDtos = AssemblyFileParser.Parse(assemblyFileCsv);
    assemblyFile = new AssemblyFile(assemblyFileDtos);

    const feederSetupDtos = FeederSetupParser.Parse(feederSetupCsv);
    feederSetup = new FeederSetup(feederSetupDtos);

    const productionFileCsvFilePath = path.resolve(
      __dirname,
      "../parsers/production-file/__mocks__/production-file-sample.mock.csv"
    );
    const productionFileCsv = fs.readFileSync(
      productionFileCsvFilePath,
      "utf8"
    );
    sampleProductionFile = new ProductionFile().fromCsv(productionFileCsv);
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
      expect(productionFile.getOperations().length).toBe(104);
      expect(operations.size).toBe(productionFile.getOperations().length);

      operations.forEach((operation) => {
        const sample = sampleProductionFile.getOperation(
          operation.designator
        ) as ProductionOperation;
        expect(sample).toBeDefined();
        expect(sample).toBeInstanceOf(ProductionOperation);
        expect(operation.designator).toBe(sample?.designator);
        expect(operation.comment).toBe(sample?.comment);
        if (sample.footprint !== null) {
          expect(operation.footprint).toBe(sample?.footprint);
        }
        expect(operation.midpointPositionX).toBe(sample?.midpointPositionX);
        expect(operation.midpointPositionY).toBe(sample?.midpointPositionY);
        expect(operation.rotation).toBe(sample?.rotation);
        expect(operation.head).toBe(0); // Not yet implemented

        expect(operation.feederNumber).toBe(sample?.feederNumber);
        expect(operation.mountSpeedPercentage).toBe(
          sample?.mountSpeedPercentage
        );
        expect(operation.pickHeightMm).toBe(sample?.pickHeightMm);
        expect(operation.placeHeightMm).toBe(sample?.placeHeightMm);
        expect(operation.mode).toBe(1); // Not yet implemented
        expect(operation.skip).toBe(0); // Not yet implemented
        expect(operation.nozzle).toBe(sample?.nozzle);
      });
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
      expect(operations.length).toBe(productionFile.getOperations().length);
    });
  });
});
