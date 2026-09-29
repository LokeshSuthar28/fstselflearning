export type GenderCategory = "Men's" | "Women's" | "Unisex";

export type SneakerColor =
  | "Triple Black"
  | "Cloud White"
  | "Volt Neon"
  | "Lunar Grey"
  | "Aurora Blue";

export interface SneakerItem {
  id: string;
  name: string;
  tagline: string;
  price: number;
  gender: GenderCategory;
  sizes: number[];
  colors: SneakerColor[];
  weightGrams: number;
  inStock: boolean;
  imageAccent: string;
  dropDate?: string;
}

export interface SneakerFilterState {
  gender: GenderCategory | "All";
  selectedSizes: number[];
  selectedColors: SneakerColor[];
  sortBy: "featured" | "price-asc" | "price-desc" | "weight-asc";
  hasHydrated: boolean;
}

export interface SneakerFilterActions {
  setGender: (gender: GenderCategory | "All") => void;
  toggleSize: (size: number) => void;
  toggleColor: (color: SneakerColor) => void;
  setSortBy: (sort: SneakerFilterState["sortBy"]) => void;
  resetFilters: () => void;
  setHasHydrated: (status: boolean) => void;
}

export type SneakerFilterStore = SneakerFilterState & SneakerFilterActions;

export interface PreorderRecord {
  reservationId: string;
  queueSpotNumber: number;
  customerName: string;
  email: string;
  shoeModel: string;
  shoeSize: number;
  preferredColor: string;
  estimatedDelivery: string;
  createdAt: string; // ISO string for safe cross-boundary serialization
}

export type ActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};
