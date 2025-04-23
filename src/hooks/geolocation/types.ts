
export interface Position {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface GeolocationState {
  position: Position | null;
  error: string | null;
  loading: boolean;
}
