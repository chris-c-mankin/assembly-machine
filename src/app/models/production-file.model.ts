import { ProductionFileParser } from "../parsers/production-file/production-file.parser";
import { AssemblyFile } from "./assembly-file.model";
import { BillOfMaterials } from "./bill-of-materials.model";
import { FeederSetup } from "./feeder-setup.model";

export class ProductionFile {
  private operations: Map<string, ProductionOperation> = new Map<
    string,
    ProductionOperation
  >();
  private manualOperations: Map<string, ManualOperation> = new Map<
    string,
    ManualOperation
  >();

  fromCsv(csv: string): ProductionFile {
    const operations = ProductionFileParser.Parse(csv);
    operations.forEach((operation) => {
      this.operations.set(operation.__key, operation);
    });
    return this;
  }

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

      const operation = new Operation();
      operation.designator = assemblyOperation.designator;
      operation.comment = sku;
      operation.footprint = assemblyOperation.footprint;
      operation.midpointPositionX = assemblyOperation.midpointPositionX;
      operation.midpointPositionY = assemblyOperation.midpointPositionY;
      operation.rotation = assemblyOperation.rotation - 180;
      operation.head = 0; // TODO: What is this?
      operation.layer = assemblyOperation.layer;

      const feederLine = feederSetup.lines.get(sku);

      if (!feederLine) {
        const manualOperation = ManualOperation.FromOperation(operation);
        this.manualOperations.set(manualOperation.__key, manualOperation);
        return;
      }

      const productionOperation = ProductionOperation.FromOperation(operation);
      productionOperation.feederNumber = feederLine.number;
      productionOperation.mountSpeedPercentage = 50; // TODO: What is this?
      productionOperation.pickHeightMm = 0; // TODO: What is this?
      productionOperation.placeHeightMm = feederLine.placeHeight || 0;
      productionOperation.mode = 1; // TODO: What is this? This will come from the feeder setup
      productionOperation.skip = 0; // TODO: What is this?
      productionOperation.nozzle = feederLine.nozzle || 0;

      this.operations.set(operation.__key, productionOperation);
    });
  }

  getOperation(
    designator: string
  ): ProductionOperation | ManualOperation | undefined {
    return (
      this.operations.get(designator) || this.manualOperations.get(designator)
    );
  }

  getOperations(): ProductionOperation[] {
    const operations = Array.from(this.operations.values());
    return this.sortOperations(operations);
  }

  getOperationsByLayer() {
    const operations = Array.from(this.operations.values());
    const sortedOperations = this.sortOperations(operations);
    const operationsByLayer = new Map<string, ProductionOperation[]>();
    sortedOperations.forEach((operation) => {
      if (!operationsByLayer.has(operation.layer)) {
        operationsByLayer.set(operation.layer, []);
      }
      operationsByLayer.get(operation.layer)?.push(operation);
    });
    return operationsByLayer;
  }

  getManualOperations(): ManualOperation[] {
    const manualOperations = Array.from(this.manualOperations.values());
    return this.sortOperations(manualOperations);
  }

  private sortOperations<T extends Operation>(operations: T[]): T[] {
    return operations.sort((a, b) => {
      if (
        a instanceof ProductionOperation &&
        b instanceof ProductionOperation
      ) {
        const nozzleComparison = this.compareNumbers(a.nozzle, b.nozzle);
        if (nozzleComparison !== 0) {
          return nozzleComparison;
        }
        const feederNumberComparison = this.compareNumbers(
          a.feederNumber,
          b.feederNumber
        );
        if (feederNumberComparison !== 0) {
          return feederNumberComparison;
        }
        // const placeHeightComparison = this.compareNumbers(
        //   a.placeHeightMm,
        //   b.placeHeightMm
        // );
        // if (placeHeightComparison !== 0) {
        //   return placeHeightComparison;
        // }
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

export class Operation {
  designator: string;
  comment: string;
  footprint: string;
  midpointPositionX: number;
  midpointPositionY: number;
  rotation: number;
  head: number;
  layer: string;

  get __key(): string {
    return this.designator;
  }
}

export class ProductionOperation extends Operation {
  feederNumber: number;
  mountSpeedPercentage: number;
  pickHeightMm: number;
  placeHeightMm: number;
  mode: number;
  skip: number;
  nozzle: number;

  static FromOperation(operation: Operation): ProductionOperation {
    const productionOperation = new ProductionOperation();
    productionOperation.designator = operation.designator;
    productionOperation.comment = operation.comment;
    productionOperation.footprint = operation.footprint;
    productionOperation.midpointPositionX = operation.midpointPositionX;
    productionOperation.midpointPositionY = operation.midpointPositionY;
    productionOperation.rotation = operation.rotation;
    productionOperation.head = operation.head;
    productionOperation.layer = operation.layer;
    return productionOperation;
  }
}

export class ManualOperation extends Operation {
  static FromOperation(operation: Operation): ManualOperation {
    const manualOperation = new ManualOperation();
    manualOperation.designator = operation.designator;
    manualOperation.comment = operation.comment;
    manualOperation.footprint = operation.footprint;
    manualOperation.midpointPositionX = operation.midpointPositionX;
    manualOperation.midpointPositionY = operation.midpointPositionY;
    manualOperation.rotation = operation.rotation;
    manualOperation.head = operation.head;
    return manualOperation;
  }
}
