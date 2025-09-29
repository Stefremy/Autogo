// Type definitions for car data used across the app
// Keep these in sync with data/schema/car.schema.json

export interface MaintenanceItem {
  date?: string;            // e.g. "24/12/2024"
  km?: number | null;       // numeric kilometers (122381)
  shop?: string | null;     // garage / shop name
  description?: string | null; // short description of the job
  price?: number | null;    // numeric price in EUR (273.10)
  raw?: string;             // original raw string when we couldn't fully parse
  [key: string]: any;       // allow extra properties for forward compatibility
}

export interface EquipamentoOpcoes {
  opcoes_valor_elevado?: string[];
  conforto?: string[];
  seguranca?: string[];
  multimedia?: string[];
  interior?: string[];
  exterior?: string[];
  outras_opcoes?: string[];
  [key: string]: string[] | undefined;
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year?: number | string;
  slug: string;
  price?: number | string;
  image?: string;
  description?: string;
  mileage?: number | string;
  country?: string;
  status?: string;
  gearboxType?: string;
  gearbox?: number;
  category?: string;
  engineSize?: string;
  power?: string;
  places?: number;
  unitNumber?: string;
  origin?: string;
  firstRegistration?: string;
  doors?: number;
  fuel?: string;
  emissionClass?: string;
  co2?: string;
  color?: string;
  vin?: string;
  images?: string[];
  equipamento_opcoes?: EquipamentoOpcoes;
  maintenance?: Array<MaintenanceItem | string>;
  [key: string]: any;
}
