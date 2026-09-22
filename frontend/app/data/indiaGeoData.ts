export interface StateGeoInfo {
  code: string;
  name: string;
  type: "state" | "ut";
  zone: "North" | "South" | "East" | "West" | "Central" | "Northeast";
  center: [number, number]; // [lat, lon]
  zoom: number;
  tagline: string;
  primaryTraditions: string[];
  color: string;
}

export const INDIA_STATES_DATA: Record<string, StateGeoInfo> = {
  // Northern Region
  "rajasthan": {
    code: "RJ",
    name: "Rajasthan",
    type: "state",
    zone: "North",
    center: [26.5, 74.2],
    zoom: 7,
    tagline: "Land of Citadels, Desert Ballads & Vivid Dyes",
    primaryTraditions: ["Jaipur Blue Pottery", "Bagru Block Print", "Mehrangarh Fort", "Kalbelia Dance", "Phad Painting"],
    color: "#b45309"
  },
  "uttar pradesh": {
    code: "UP",
    name: "Uttar Pradesh",
    type: "state",
    zone: "North",
    center: [26.8, 80.9],
    zoom: 7,
    tagline: "The Sacred Gangetic Heart of Weaves, Perfumes & Awadhi Tehzeeb",
    primaryTraditions: ["Banarasi Silk", "Lucknow Chikankari", "Kashi Vishwanath Ghats", "Agra Fort", "Kannauj Attar"],
    color: "#b91c1c"
  },
  "himachal pradesh": {
    code: "HP",
    name: "Himachal Pradesh",
    type: "state",
    zone: "North",
    center: [31.8, 77.2],
    zoom: 8,
    tagline: "Devbhoomi of Kath-Kuni Timber Temples, Wool Weaves & Mountain Kuhls",
    primaryTraditions: ["Kath-Kuni Architecture", "Kullu Shawls", "Chamba Rumal", "Kangra Miniatures", "Kuhl Canals"],
    color: "#0f766e"
  },
  "punjab": {
    code: "PB",
    name: "Punjab",
    type: "state",
    zone: "North",
    center: [31.1, 75.3],
    zoom: 8,
    tagline: "Land of Five Rivers, Golden Sanctuaries, Phulkari & Sacred Langar",
    primaryTraditions: ["Sri Harmandir Sahib", "Phulkari Embroidery", "Dhadhi Folk Bards", "Langar Seva", "Makki-Sarson"],
    color: "#c2410c"
  },
  "haryana": {
    code: "HR",
    name: "Haryana",
    type: "state",
    zone: "North",
    center: [29.1, 76.4],
    zoom: 8,
    tagline: "Cradle of Vedic Civilization, Surajkund Crafts & Folk Raginis",
    primaryTraditions: ["Surajkund Mela", "Saang Musical Theatre", "Panipat Handloom", "Pahari Folk Ballads"],
    color: "#854d0e"
  },
  "jammu and kashmir": {
    code: "JK",
    name: "Jammu & Kashmir",
    type: "ut",
    zone: "North",
    center: [33.7, 75.0],
    zoom: 8,
    tagline: "Paradise of Pashmina Weaving, Walnut Wood Carving & Sufiana Kalam",
    primaryTraditions: ["Kashmiri Pashmina", "Walnut Woodcraft", "Kani Shawls", "Paper Mâché"],
    color: "#0369a1"
  },
  "ladakh": {
    code: "LA",
    name: "Ladakh",
    type: "ut",
    zone: "North",
    center: [34.2, 77.6],
    zoom: 7,
    tagline: "High Mountain Monastery Citadels, Thangkas & Pashmina Nomads",
    primaryTraditions: ["Ladakhi Thangka", "Pashmina Changthangi", "Hemis Monastic Festival"],
    color: "#4338ca"
  },
  "uttarakhand": {
    code: "UK",
    name: "Uttarakhand",
    type: "state",
    zone: "North",
    center: [30.1, 79.0],
    zoom: 8,
    tagline: "Abode of Gods, Aipan Folk Floor Art & Himalayan Sacred Shrines",
    primaryTraditions: ["Aipan Geometric Art", "Baranaja Biodiversity", "Ringal Bamboo Craft"],
    color: "#047857"
  },
  "delhi": {
    code: "DL",
    name: "Delhi",
    type: "ut",
    zone: "North",
    center: [28.6, 77.2],
    zoom: 11,
    tagline: "Historic Confluence of Sultanate Monuments, Ghalib Poetry & Craft Guilds",
    primaryTraditions: ["Mughal Zari Zardozi", "Red Fort Heritage", "Nizamuddin Qawwali"],
    color: "#9333ea"
  },
  "chandigarh": {
    code: "CH",
    name: "Chandigarh",
    type: "ut",
    zone: "North",
    center: [30.7, 76.8],
    zoom: 12,
    tagline: "City of Modernist Architecture & Nek Chand's Rock Garden",
    primaryTraditions: ["Nek Chand Rock Sculpture", "Modernist Corbusier Heritage"],
    color: "#475569"
  },

  // Western Region
  "gujarat": {
    code: "GJ",
    name: "Gujarat",
    type: "state",
    zone: "West",
    center: [22.3, 71.2],
    zoom: 7,
    tagline: "Land of Patan Patola Silk, Rogan Painting, Stepwells & Garba",
    primaryTraditions: ["Patan Double Ikat", "Kutch Rogan Art", "Rani ki Vav", "Ajrakh Printing"],
    color: "#d97706"
  },
  "maharashtra": {
    code: "MH",
    name: "Maharashtra",
    type: "state",
    zone: "West",
    center: [19.8, 75.3],
    zoom: 7,
    tagline: "Reign of Shivaji Hill Fortresses, Warli Tribal Art & Paithani Weaves",
    primaryTraditions: ["Warli Painting", "Paithani Sarees", "Ajanta & Ellora Caves", "Lavani Dance"],
    color: "#dc2626"
  },
  "goa": {
    code: "GA",
    name: "Goa",
    type: "state",
    zone: "West",
    center: [15.3, 74.0],
    zoom: 10,
    tagline: "Coastal Confluence of Indo-Portuguese Baroque Churches & Kunbi Weaves",
    primaryTraditions: ["Kunbi Saree", "Azulejos Ceramic Tiles", "Shigmo Festival"],
    color: "#0284c7"
  },

  // Central Region
  "madhya pradesh": {
    code: "MP",
    name: "Madhya Pradesh",
    type: "state",
    zone: "Central",
    center: [23.5, 77.4],
    zoom: 7,
    tagline: "Heart of India: Gond Tribal Art, Chanderi Silk & Khajuraho Temples",
    primaryTraditions: ["Gond Folk Art", "Chanderi Weaving", "Bagh Block Print", "Bhimbetka Caves"],
    color: "#16a34a"
  },
  "chhattisgarh": {
    code: "CG",
    name: "Chhattisgarh",
    type: "state",
    zone: "Central",
    center: [21.3, 81.9],
    zoom: 7,
    tagline: "Sanctuary of Bastar Dhokra Bell-Metal Casting & Kosa Tussar Silk",
    primaryTraditions: ["Bastar Dhokra Casting", "Kosa Silk", "Godna Tattoo Art"],
    color: "#a16207"
  },

  // Eastern Region
  "west bengal": {
    code: "WB",
    name: "West Bengal",
    type: "state",
    zone: "East",
    center: [23.2, 87.9],
    zoom: 7,
    tagline: "Cradle of Kantha Needlecraft, Baul Mystic Songs & Terracotta Temples",
    primaryTraditions: ["Kantha Embroidery", "Bishnupur Terracotta", "Baul Music", "Jamdani Weaving"],
    color: "#e11d48"
  },
  "odisha": {
    code: "OD",
    name: "Odisha",
    type: "state",
    zone: "East",
    center: [20.9, 85.1],
    zoom: 7,
    tagline: "Realm of Pattachitra Palm Scrolls, Konark Sun Temple & Sambalpuri Ikat",
    primaryTraditions: ["Pattachitra Painting", "Sambalpuri Ikat", "Odissi Classical Dance"],
    color: "#ea580c"
  },
  "bihar": {
    code: "BR",
    name: "Bihar",
    type: "state",
    zone: "East",
    center: [25.1, 85.3],
    zoom: 7,
    tagline: "Ancient Land of Madhubani Mithila Paintings & Nalanda Scholarship",
    primaryTraditions: ["Madhubani Mithila Art", "Sujani Embroidery", "Sikki Grass Craft"],
    color: "#9333ea"
  },
  "jharkhand": {
    code: "JH",
    name: "Jharkhand",
    type: "state",
    zone: "East",
    center: [23.6, 85.3],
    zoom: 8,
    tagline: "Forest Haven of Sohrai-Khovar Mural Art & Chhau Martial Mask Dance",
    primaryTraditions: ["Sohrai Murals", "Seraikela Chhau", "Paitkar Painting"],
    color: "#15803d"
  },

  // Southern Region
  "tamil nadu": {
    code: "TN",
    name: "Tamil Nadu",
    type: "state",
    zone: "South",
    center: [11.1, 78.7],
    zoom: 7,
    tagline: "Living Legacy of Chola Bronze Casting, Kanchipuram Silk & Gopurams",
    primaryTraditions: ["Swamimalai Bronze", "Kanchipuram Silk", "Tanjore Painting", "Bharatanatyam"],
    color: "#b91c1c"
  },
  "kerala": {
    code: "KL",
    name: "Kerala",
    type: "state",
    zone: "South",
    center: [10.5, 76.5],
    zoom: 8,
    tagline: "God's Own Country: Kathakali Drama, Aranmula Metal Mirrors & Theyyam",
    primaryTraditions: ["Aranmula Kannadi", "Kathakali & Theyyam", "Kalaripayattu Martial Art"],
    color: "#059669"
  },
  "karnataka": {
    code: "KA",
    name: "Karnataka",
    type: "state",
    zone: "South",
    center: [15.3, 75.7],
    zoom: 7,
    tagline: "Empire of Hampi Stone Chariots, Mysore Sandalwood & Bidri Inlay",
    primaryTraditions: ["Bidri Metal Inlay", "Mysore Silk", "Kinnal Painted Woodcraft", "Yakshagana"],
    color: "#d97706"
  },
  "andhra pradesh": {
    code: "AP",
    name: "Andhra Pradesh",
    type: "state",
    zone: "South",
    center: [15.9, 79.7],
    zoom: 7,
    tagline: "Sanctuary of Kalamkari Natural Pen Art, Kondapalli Toys & Kuchipudi",
    primaryTraditions: ["Kalamkari Art", "Kondapalli Toys", "Uppada Jamdani", "Kuchipudi Dance"],
    color: "#7c3aed"
  },
  "telangana": {
    code: "TG",
    name: "Telangana",
    type: "state",
    zone: "South",
    center: [17.9, 79.1],
    zoom: 8,
    tagline: "Heritage of Pochampally Telia Rumal, Nirmal Lacquer & Kakatiya Temples",
    primaryTraditions: ["Pochampally Ikat", "Telia Rumal", "Nirmal Paintings", "Cheriyal Scrolls"],
    color: "#c026d3"
  },

  // Northeast Region
  "assam": {
    code: "AS",
    name: "Assam",
    type: "state",
    zone: "Northeast",
    center: [26.2, 92.9],
    zoom: 7,
    tagline: "Valley of Golden Muga Silk, Majuli Island Mask Making & Bihu Rhythms",
    primaryTraditions: ["Muga Golden Silk", "Majuli Mask Craft", "Sarthebari Bell Metal", "Bihu Dance"],
    color: "#b45309"
  },
  "manipur": {
    code: "MN",
    name: "Manipur",
    type: "state",
    zone: "Northeast",
    center: [24.8, 93.9],
    zoom: 8,
    tagline: "Jeweled Land of Longpi Black Pottery, Manipuri Rasleela & Kauna Reed",
    primaryTraditions: ["Longpi Stone Pottery", "Manipuri Classical Dance", "Kauna Mat Weaving"],
    color: "#0891b2"
  },
  "meghalaya": {
    code: "ML",
    name: "Meghalaya",
    type: "state",
    zone: "Northeast",
    center: [25.5, 91.4],
    zoom: 8,
    tagline: "Abode of Clouds: Indigenous Living Root Bridges & Ryndia Eri Silk",
    primaryTraditions: ["Living Root Bridges", "Eri Peace Silk", "Khasi Cane Weaving"],
    color: "#166534"
  },
  "nagaland": {
    code: "NL",
    name: "Nagaland",
    type: "state",
    zone: "Northeast",
    center: [26.1, 94.6],
    zoom: 8,
    tagline: "Highland of Naga Warrior Shawls, Wood Carving & Hornbill Heritage",
    primaryTraditions: ["Naga Loin-Loom Shawls", "Tribal Wood Carving", "Hornbill Traditions"],
    color: "#be123c"
  },
  "arunachal pradesh": {
    code: "AR",
    name: "Arunachal Pradesh",
    type: "state",
    zone: "Northeast",
    center: [28.2, 94.7],
    zoom: 7,
    tagline: "Dawn-lit Mountains: Monpa Carpet Weaving & Tawang Monasteries",
    primaryTraditions: ["Monpa Wood Masks", "Tawang Monastery Heritage", "Apatani Cane Craft"],
    color: "#0e7490"
  },
  "mizoram": {
    code: "MZ",
    name: "Mizoram",
    type: "state",
    zone: "Northeast",
    center: [23.2, 92.8],
    zoom: 8,
    tagline: "Songbird Hills: Puan Geometric Handlooms & Cheraw Bamboo Dance",
    primaryTraditions: ["Puan Traditional Weave", "Cheraw Bamboo Dance"],
    color: "#9d174d"
  },
  "tripura": {
    code: "TR",
    name: "Tripura",
    type: "state",
    zone: "Northeast",
    center: [23.7, 91.7],
    zoom: 9,
    tagline: "Kingdom of Bamboo Filigree Craft & Risa Handloom Weaving",
    primaryTraditions: ["Tripura Bamboo Craft", "Risa Textile Weave"],
    color: "#4f46e5"
  },
  "sikkim": {
    code: "SK",
    name: "Sikkim",
    type: "state",
    zone: "Northeast",
    center: [27.5, 88.5],
    zoom: 9,
    tagline: "Kingdom in the Clouds: Lepcha Woodcarving, Lepcha Weaves & Choktse Tables",
    primaryTraditions: ["Choktse Carved Tables", "Thangka Painting", "Lepcha Weaving"],
    color: "#0369a1"
  }
};

export const CULTURAL_DOMAINS = [
  { id: "all", label: "All Living Heritage", icon: "✨", color: "#b15f2c" },
  { id: "food", label: "Food & Culinary", icon: "🍲", color: "#d48b28" },
  { id: "craft", label: "Crafts & Artisans", icon: "🏺", color: "#b15f2c" },
  { id: "textile", label: "Textiles & Weaves", icon: "🧵", color: "#8c3b52" },
  { id: "clothing", label: "Clothing & Attire", icon: "👘", color: "#6a4c93" },
  { id: "art", label: "Art & Folk Paintings", icon: "🎨", color: "#c2410c" },
  { id: "folklore", label: "Folklore & Ballads", icon: "📜", color: "#2d6a4f" },
  { id: "music", label: "Music & Bards", icon: "🪕", color: "#1d3557" },
  { id: "dance", label: "Dance & Movement", icon: "💃", color: "#e63946" },
  { id: "performing_arts", label: "Performing Arts", icon: "🎭", color: "#c026d3" },
  { id: "festival", label: "Festivals & Melas", icon: "🎉", color: "#b5179e" },
  { id: "architecture", label: "Forts & Citadels", icon: "🏰", color: "#78350f" },
  { id: "spiritual", label: "Spiritual & Sacred", icon: "🛕", color: "#ea580c" },
  { id: "cultural_practices", label: "Cultural Practices", icon: "🪔", color: "#0f766e" },
  { id: "traditional_knowledge", label: "Traditional Knowledge", icon: "🌿", color: "#15803d" },
  { id: "events", label: "Live Events", icon: "🔴", color: "#dc2626" },
];

export const REGIONAL_ZONES = ["All", "North", "South", "East", "West", "Central", "Northeast"];
