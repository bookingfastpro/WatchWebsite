export interface Watch {
  id: string;
  name: string;
  brand: string;
  price: number;
  type: string;
  description: string;
  specs: {
    movement: string;
    material: string;
    powerReserve: string;
    waterResistance: string;
    year?: string;
    set?: string;
  };
  images: string[];
}
