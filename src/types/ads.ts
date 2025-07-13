export interface Ad {
  id: string;
  name: string;
  target_url: string;
  image: string;
  image_url: string;
  active: boolean;
  ad_group_id: string;
  views: number;
  clicks: number;
  created_at: string;
  updated_at: string;

  
}

export interface AdGroup {
  id: string;
  name: string;
  frequency: number;
  start_date: string | null;
  end_date: string | null;
  display_pages: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
  ads: Ad[];
}
