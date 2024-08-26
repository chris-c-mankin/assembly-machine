import { AssemblyOperationDto } from "../dtos/assembly-operation.dto";

export class AssemblyFile {
  operations: Map<string, AssemblyOperation>;

  constructor(dtos: AssemblyOperationDto[]) {
    this.operations = new Map<string, AssemblyOperation>();
    dtos.forEach((dto) => {
      const operation = AssemblyOperation.FromAssemblyOperationDto(dto);
      this.operations.set(operation.__key, operation);
    });
  }

  isValid() {
    return true;
  }
}

export class AssemblyOperation {
  designator: string;
  footprint: string;
  midpointPositionX: number;
  midpointPositionY: number;
  referencePositionX: number;
  referencePositionY: number;
  padPositionX: number;
  padPositionY: number;
  layer: string;
  rotation: number;
  comment: string;

  get __key() {
    return this.designator;
  }

  static FromAssemblyOperationDto(dto: AssemblyOperationDto) {
    const model = new AssemblyOperation();
    model.designator = dto.designator;
    model.footprint = dto.footprint;
    model.midpointPositionX = dto.midpointPositionX;
    model.midpointPositionY = dto.midpointPositionY;
    model.referencePositionX = dto.referencePositionX;
    model.referencePositionY = dto.referencePositionY;
    model.padPositionX = dto.padPositionX;
    model.padPositionY = dto.padPositionY;
    model.layer = dto.layer;
    model.rotation = dto.rotation;
    model.comment = dto.comment;
    return model;
  }
}
