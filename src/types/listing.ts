
export interface ListingType {
  id: string;
  title: string;
  description?: string;
  price?: number;
  category: string;
  status: string;
  userName: string;
  userId?: string;
  location: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt?: Date;
  images?: string[];
  saved?: boolean;
  flags?: number;
  views?: number;
  postedTime?: string;
}
