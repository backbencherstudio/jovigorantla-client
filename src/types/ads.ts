
export interface Ad {
  id: string;
  name: string;
  imageUrl: string;
  targetUrl: string;
  order: number;
  createdAt: Date;
  views: number;
  clicks: number;
  active: boolean;
}

export interface AdGroup {
  id: string;
  name: string;
  pages: string[]; // Home, Marketplace, etc.
  ads: Ad[];
  rotationMode: 'sequential' | 'random';
  frequency: number; // Show ad after every X listing cards
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  createdAt: Date;
}
