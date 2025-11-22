export interface LottoSet {
  id: string;
  numbers: number[];
  date: string;
  type: 'AUTO' | 'AI';
  reason?: string; // Used for AI generation reasoning
}

export enum BallColor {
  Yellow = 'bg-yellow-500',
  Blue = 'bg-blue-600',
  Red = 'bg-red-600',
  Gray = 'bg-gray-500',
  Green = 'bg-green-600',
}

export interface GenerateResponse {
  numbers: number[];
  reason?: string;
}