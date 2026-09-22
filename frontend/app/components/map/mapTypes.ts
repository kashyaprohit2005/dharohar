export type MapLevel = "INDIA" | "STATE" | "DISTRICT" | "ITEM";

export interface GeoState {
  code: string;
  name: string;
  zone: string;
  center: [number, number];
  zoom: number;
  tagline: string;
  is_demo_deep: boolean;
}

export interface GeoDistrict {
  slug: string;
  name: string;
  headquarters: string;
  state_code: string;
  center: [number, number];
  zoom: number;
  odop_product?: string | null;
  odop_category?: string | null;
  odop_source?: string | null;
  odop_status: "VERIFIED" | "PENDING_SOURCE" | "NOT_AVAILABLE" | string;
  cultural_intro: string;
  tourism_url?: string | null;
  items_count?: number;
}

export interface DistrictDossier extends Omit<GeoDistrict, "odop_product" | "odop_category" | "odop_source" | "odop_status"> {
  odop: {
    product: string | null;
    category: string | null;
    source: string | null;
    status: "VERIFIED" | "PENDING_SOURCE" | "NOT_AVAILABLE" | string;
  };
  total_items: number;
  categories_breakdown: Record<string, number>;
  localities: Array<{
    slug: string;
    name: string;
    type: string;
    center: [number, number];
  }>;
  locations: Array<{
    slug: string;
    name: string;
    type: string;
    lat: number;
    lon: number;
    address: string;
  }>;
}

export interface CulturalSource {
  name: string;
  url?: string | null;
  tier: "TIER_1_GOVERNMENT" | "TIER_2_INSTITUTION" | "TIER_3_SCHOLARLY" | "TIER_4_COMMUNITY" | string;
  publisher: string;
  date: string;
  verification_status: "VERIFIED" | "PENDING_SOURCE" | "UNVERIFIED" | string;
  evidence_level: "HIGH" | "MEDIUM" | "EMERGING" | string;
  citation: string;
}

export interface CulturalItem {
  id: number;
  slug: string;
  title: string;
  category: "CRAFTS" | "FOOD" | "MONUMENTS" | "TRADITIONS" | "EVENTS" | "ART" | "PEOPLE" | string;
  district_slug: string;
  location_slug?: string | null;
  location_name?: string | null;
  lat?: number | null;
  lon?: number | null;
  address?: string | null;
  short_description: string;
  detailed_overview: string;
  image_url?: string | null;
  image_caption?: string;
  image_source?: string;
  audio_type: "RECORDED_STORY" | "AI_NARRATION" | string;
  audio_url?: string | null;
  audio_script?: string | null;
  verification_tier: "OFFICIAL_VERIFIED" | "SOURCE_BACKED" | "COMMUNITY_PENDING" | string;
  story_slug?: string | null;
  sources: CulturalSource[];
}

export interface CulturalStoryChapter {
  title: string;
  image?: string;
  text: string;
}

export interface CulturalStory {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  hero_image?: string | null;
  audio_type: "RECORDED_STORY" | "AI_NARRATION" | string;
  audio_script?: string | null;
  chapters: CulturalStoryChapter[];
  sources: CulturalSource[];
}

export interface CategoryFilterConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface MapBreadcrumbItem {
  label: string;
  level: MapLevel;
  data?: any;
}

export interface RecommendationItem {
  slug: string;
  title: string;
  category: string;
  distance_km: number;
  district_name: string;
  verification_tier: string;
  image_url?: string | null;
}

export interface ItemRecommendations {
  item_slug: string;
  nearby_crafts: RecommendationItem[];
  nearby_food: RecommendationItem[];
  nearby_heritage: RecommendationItem[];
  nearby_events: RecommendationItem[];
  nearby_nature: RecommendationItem[];
  nearby_traditions: RecommendationItem[];
}

export interface ShareCardData {
  title: string;
  description: string;
  image_url?: string | null;
  category: string;
  district_name: string;
  state_name: string;
  share_url: string;
  verification_tier: string;
  dharohar_tagline: string;
}

export interface RelatedItemSummary {
  slug: string;
  title: string;
  category: string;
  verification_tier: string;
  image_url?: string | null;
}

export interface RelatedItemsData {
  same_location: RelatedItemSummary[];
  same_category: RelatedItemSummary[];
  same_district: RelatedItemSummary[];
}
