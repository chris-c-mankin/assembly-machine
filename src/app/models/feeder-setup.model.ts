import { FeederConfigurationLineDto } from "../dtos/feeder-configuration-line.dto";

export class FeederSetup {
  lines: Map<string, FeederConfigurationLine>;

  constructor(dtos: FeederConfigurationLineDto[]) {
    this.lines = new Map<string, FeederConfigurationLine>();
    dtos.forEach((dto) => {
      const line = FeederConfigurationLine.FromDto(dto);
      if (line.__key) {
        this.lines.set(line.__key, line);
      }
    });
  }

  isValid() {
    return true;
  }
}

export class FeederConfigurationLine {
  type: string;
  number: number;
  partNumber: number | null;
  description: string | null;
  quantity: number | null;
  sku: string | null;
  placeHeight: number | null;
  nozzle: number | null;

  get __key() {
    return this.sku;
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
