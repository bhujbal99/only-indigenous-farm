
export type Language = 'en' | 'mr';
export type Theme = 'green' | 'orange';

export enum Breed {
  Gavaran = 'Gavaran',
  Desi = 'Desi',
  Kadaknath = 'Kadaknath',
  Vanaraja = 'Vanaraja',
  Kaveri = 'Kaveri'
}

export enum HealthStatus {
  Healthy = 'Healthy',
  Sick = 'Sick',
  Recovering = 'Recovering',
  Injured = 'Injured'
}

export enum BirdType {
  Hen = 'Hen',
  Chick = 'Chick',
  Rooster = 'Rooster'
}

export interface Hen {
  id: string;
  breed: Breed;
  hatchDate: string;
  quantity: number;
  healthStatus: HealthStatus;
  notes: string;
}

export interface Rooster {
  id: string;
  breed: Breed;
  hatchDate: string;
  quantity: number;
  weight: number;
  healthStatus: HealthStatus;
  notes?: string;
  addedAt: number;
}

export interface Chick {
  id: string;
  breed: Breed;
  hatchDate: string;
  quantity: number;
  healthStatus: HealthStatus;
  notes: string;
}

export interface EggProduction {
  id: string;
  date: string;
  collected: number;
  damaged: number;
  notes: string;
}

export interface Medicine {
  id: string;
  date: string;
  name: string;
  dosage: string;
  givenTo: string; // ID of Hen or Chick Batch
  nextDueDate: string;
  notes: string;
}

export interface Mortality {
  id: string;
  date: string;
  birdId: string;
  type: BirdType;
  cause: string;
  lossValue: number;
}

export interface Expense {
  id: string;
  date: string;
  type: string;
  quantity: string;
  cost: number;
}

export interface Sale {
  id: string;
  date: string;
  product: 'Eggs' | 'Birds' | 'Chicks';
  quantity: number;
  amount: number;
  customerName: string;
}

export interface FarmState {
  hens: Hen[];
  roosters: Rooster[];
  chicks: Chick[];
  eggProduction: EggProduction[];
  medicines: Medicine[];
  mortalities: Mortality[];
  expenses: Expense[];
  sales: Sale[];
}
