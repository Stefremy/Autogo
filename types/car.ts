/**
 * Car data type definitions for the Autogo platform
 */

export interface Car {
    id: string;
    make: string;
    model: string;
    year: number;
    slug: string;
    price: number;
    priceDisplay?: string;
    image: string;
    description?: string;
    mileage: number | null;
    country: string;
    status?: CarStatus | null | '';
    gearboxType?: string;
    gearbox?: number | null;
    category?: string;
    engineSize?: string | null;
    power?: string;
    places?: number;
    unitNumber?: string;
    origin?: string;
    firstRegistration?: string | null;
    doors?: number;
    fuel?: string;
    emissionClass?: string;
    co2?: string;
    color?: string;
    vin?: string;
    images?: string[];
    equipamento_opcoes?: CarEquipment;
    maintenance?: MaintenanceRecord[];
}

export type CarStatus = 'disponivel' | 'vendido' | 'sob_consulta' | 'novidade';

export interface CarEquipment {
    opcoes_valor_elevado?: string[];
    conforto?: string[];
    seguranca?: string[];
    multimedia?: string[];
    interior?: string[];
    exterior?: string[];
    outras_opcoes?: string[];
}

export interface MaintenanceRecord {
    date?: string | null;
    km?: number;
    shop?: string;
    description?: string;
    desc?: string;
    price?: number;
    raw?: string;
    ts?: number;
}

/**
 * Filters for the vehicle listing page
 */
export interface VehicleFilters {
    marca: string;
    modelo: string;
    ano: string;
    mes: string;
    dia: string;
    km: string;
    countryFilter: string;
    minPrice: string;
    maxPrice: string;
    itemsLoaded: number;
    ts?: number;
}

/**
 * Car card status colors mapping
 */
export const CAR_STATUS_COLORS: Record<CarStatus, string> = {
    disponivel: 'bg-green-500',
    vendido: 'bg-gray-400',
    sob_consulta: 'bg-yellow-400',
    novidade: 'bg-blue-500',
};

/**
 * Type guard to check if a value is a valid CarStatus
 */
export function isCarStatus(value: unknown): value is CarStatus {
    return typeof value === 'string' && ['disponivel', 'vendido', 'sob_consulta', 'novidade'].includes(value);
}

/**
 * Helper to safely parse car price
 */
export function parseCarPrice(price: unknown): number | null {
    if (typeof price === 'number' && Number.isFinite(price)) return price;
    if (typeof price === 'string') {
        const digits = price.replace(/[^0-9.-]/g, '');
        const n = Number(digits);
        return Number.isFinite(n) ? n : null;
    }
    return null;
}

/**
 * Helper to safely parse car mileage
 */
export function parseCarMileage(mileage: unknown): number | null {
    if (mileage == null) return null;
    if (typeof mileage === 'number') return mileage;
    const n = parseInt(String(mileage).replace(/[^0-9]/g, ''), 10);
    return Number.isFinite(n) ? n : null;
}
