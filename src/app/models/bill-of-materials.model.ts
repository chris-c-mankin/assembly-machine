import { BillOfMaterialsComponentDto } from "../dtos/bill-of-materials-component.dto";

export class BillOfMaterials {
  components: Map<string, BillOfMaterialsComponent>;
  designatorSkuMapping: Map<string, string> = new Map<string, string>();

  constructor(dtos: BillOfMaterialsComponentDto[]) {
    this.components = new Map<string, BillOfMaterialsComponent>();
    dtos.forEach((dto) => {
      const component = BillOfMaterialsComponent.FromDto(dto);
      this.components.set(component.__key, component);
      this.designatorSkuMapping.set(component.designator, component.sku);
    });
  }

  isValid() {
    return true;
  }
}

export class BillOfMaterialsComponent {
  comment: string;
  description: string;
  quantity: number;
  sku: string;
  designator: string;

  get __key() {
    return `${this.sku}-${this.designator}`;
  }

  static FromDto(dto: BillOfMaterialsComponentDto) {
    const model = new BillOfMaterialsComponent();
    model.comment = dto.comment;
    model.description = dto.description;
    model.quantity = dto.quantity;
    model.sku = dto.sku;
    model.designator = dto.designator;
    return model;
  }
}
