import { AssemblyFile } from "./assembly-file.model";
import { BillOfMaterials } from "./bill-of-materials.model";
import { FeederSetup } from "./feeder-setup.model";

export class ProductionFile {
  private operations: Map<string, ProductionOperation> = new Map<
    string,
    ProductionOperation
  >();

  generateOperations(
    billOfMaterials: BillOfMaterials,
    assemblyFile: AssemblyFile,
    feederSetup: FeederSetup
  ): void {
    assemblyFile.operations.forEach((assemblyOperation) => {
      const sku = billOfMaterials.designatorSkuMapping.get(
        assemblyOperation.designator
      );
      if (!sku) {
        throw new Error(
          "Error mapping Assemble File and BOM: No SKU found in BOM for designator: " +
            assemblyOperation.designator
        );
      }
      const feederLine = feederSetup.lines.get(sku);
      if (!feederLine) {
        throw new Error(
          "Error mapping Assemble File and Feeder Setup: No Feeder Line found in Feeder Setup for SKU: " +
            sku
        );
      }

      const operation = new ProductionOperation();
      operation.designator = assemblyOperation.designator;
      operation.comment = sku;
      operation.footprint = assemblyOperation.footprint;
      operation.midpointPositionX = assemblyOperation.midpointPositionX;
      operation.midpointPositionY = assemblyOperation.midpointPositionY;
      operation.rotation = assemblyOperation.rotation;
      operation.head = 0; // TODO: What is this?
      operation.feederNumber = feederLine.number;
      operation.mountSpeedPercentage = 50; // TODO: What is this?
      operation.pickHeightMm = 0; // TODO: What is this?
      operation.placeHeightMm = feederLine.placeHeight || 0;
      operation.mode = 1; // TODO: What is this?
      operation.skip = 0; // TODO: What is this?
      operation.nozzle = feederLine.nozzle || 0;

      this.operations.set(operation.__key, operation);
    });
  }

  getOperations(): ProductionOperation[] {
    const operations = Array.from(this.operations.values());
    return this.sortOperations(operations);
  }

  private sortOperations(
    operations: ProductionOperation[]
  ): ProductionOperation[] {
    return operations.sort((a, b) => {
      const nozzleComparison = this.compareNumbers(a.nozzle, b.nozzle);
      if (nozzleComparison !== 0) {
        return nozzleComparison;
      }
      const placeHeightComparison = this.compareNumbers(
        a.placeHeightMm,
        b.placeHeightMm
      );
      if (placeHeightComparison !== 0) {
        return placeHeightComparison;
      }
      const skuComparison = this.compareSkus(a.comment, b.comment);
      if (skuComparison !== 0) {
        return skuComparison;
      }
      return this.compareDesignators(a.designator, b.designator);
    });
  }

  private compareNumbers(a: number, b: number): number {
    return a - b;
  }

  private compareSkus(a: string, b: string): number {
    return a.localeCompare(b);
  }

  private compareDesignators(a: string, b: string): number {
    // Designators usually have some letters followed by a number
    // We want to sort them by the letters first and then by the number
    const aLetters = a.match(/[a-zA-Z]+/g);
    const bLetters = b.match(/[a-zA-Z]+/g);
    if (!aLetters || !bLetters) {
      return a.localeCompare(b);
    }
    const aNumber = parseInt(a.match(/\d+/g)![0]);
    const bNumber = parseInt(b.match(/\d+/g)![0]);

    const letterComparison = aLetters[0].localeCompare(bLetters[0]);
    if (letterComparison !== 0) {
      return letterComparison;
    }

    return aNumber - bNumber;
  }
}

export class ProductionOperation {
  designator: string;
  comment: string;
  footprint: string;
  midpointPositionX: number;
  midpointPositionY: number;
  rotation: number;
  head: number;
  feederNumber: number;
  mountSpeedPercentage: number;
  pickHeightMm: number;
  placeHeightMm: number;
  mode: number;
  skip: number;
  nozzle: number;

  get __key(): string {
    return this.designator;
  }
}
