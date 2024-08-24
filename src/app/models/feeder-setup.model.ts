import { FeederConfigurationLineDto } from "../dtos/feeder-configuration-line.dto";

export class FeederSetup {
  lines: Map<string, FeederConfigurationLine>;

  constructor(dtos: FeederConfigurationLineDto[]) {
    this.lines = new Map<string, FeederConfigurationLine>();
    dtos.forEach((dto) => {
      const line = FeederConfigurationLine.FromDto(dto);
      this.lines.set(line.__key, line);
    });
  }
}

export class FeederConfigurationLine {
  type: string;
  number: number;
  partNumber?: number;
  description?: string;
  quantity: number;
  sku: string;
  placeHeight?: number;
  nozzle?: number;

  get __key() {
    return this.number.toString();
  }

  static FromDto(dto: FeederConfigurationLineDto) {
    const model = new FeederConfigurationLine();
    model.type = dto.type;
    model.number = dto.number;
    model.partNumber = dto.partNumber;
    model.description = dto.description;
    model.quantity = dto.quantity;
    model.sku = dto.sku;
    model.placeHeight = dto.placeHeight;
    model.nozzle = dto.nozzle;
    return model;
  }
}
