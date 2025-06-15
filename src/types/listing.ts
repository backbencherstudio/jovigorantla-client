
// export interface ListingType {
//   id: string;
//   title: string;
//   description?: string;
//   price?: number;
//   category: string;
//   status: string;
//   userName: string;
//   userId?: string;
//   location: string;
//   contactEmail?: string;
//   contactPhone?: string;
//   createdAt: Date;
//   updatedAt?: Date;
//   images?: string[];
//   saved?: boolean;
//   flags?: number;
//   views?: number;
//   postedTime?: string;
// }

export interface ListingType {
  category: string;
  created_at: string;
  distance_meters: number;
  id: string;
  latitude: number;
  location: string;
  longitude: number;
  slug: string | null;
  sub_category: string;
  title: string;
  type: string;
  updated_at: string;
  user_id: string;
  user_name: string;
  views?: number;
  target_url?: string;
  image?: string;
  image_url?: string;
  ad_group_id?: string;
  address?: string;
  user: {
    id: string;
    name: string;
  }
}

