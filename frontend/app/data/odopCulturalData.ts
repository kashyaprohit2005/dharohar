export interface ODOPDistrictItem {
  district: string;
  productName: string;
  category: 'Handicrafts' | 'Handlooms' | 'Food Processing' | 'Agriculture';
  giTagged: boolean;
  description: string;
}

export interface StateCulturalProfile {
  id: string;
  stateName: string;
  coordinates: [number, number];
  heroImage: string;
  odopProducts: ODOPDistrictItem[];
  food: {
    signatureDishes: string[];
    description: string;
  };
  cultureAndFolklore: {
    traditions: string[];
    description: string;
  };
  songsAndDances: {
    performingArts: string[];
    description: string;
  };
  craftsAndHandlooms: {
    signatureCrafts: string[];
    description: string;
  };
  traditionalClothes: {
    attire: string[];
    description: string;
  };
  spiritualPlaces: {
    sites: string[];
    description: string;
  };
  historicMonuments: {
    monuments: string[];
    description: string;
  };
}

export const ODOP_CULTURAL_DATA: Record<string, StateCulturalProfile> = {
  "uttar-pradesh": {
    "id": "uttar-pradesh",
    "stateName": "Uttar Pradesh",
    "coordinates": [
      26.8467,
      80.9462
    ],
    "heroImage": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Varanasi",
        "productName": "Banarasi Brocade & Silk Sarees",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Opulent gold and silver metallic zari interlocking motifs woven on traditional pit looms."
      },
      {
        "district": "Kannauj",
        "productName": "Kannauj Attar (Natural Perfume)",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Deg-Bhapka hydro-distillation of pure botanical blossoms into pure sandalwood oil base."
      },
      {
        "district": "Bhadohi",
        "productName": "Handmade Woolen & Silk Carpets",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Intricate Persian and Mughal knotted carpets crafted across village weaving clusters."
      },
      {
        "district": "Lucknow",
        "productName": "Chikankari Shadow Embroidery",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Delicate 32-stitch needlecraft on sheer muslin fabrics with floral jaali patterns."
      },
      {
        "district": "Moradabad",
        "productName": "Brass Metal Artware",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Engraved, etched, and electroplated brass artifacts cast using generational sand molds."
      },
      {
        "district": "Firozabad",
        "productName": "Artisanal Glassware & Bangles",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Mouth-blown crystal chandeliers, decorative glassware, and rainbow glass bangles."
      },
      {
        "district": "Gorakhpur",
        "productName": "Terracotta Sculptures",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Natural red clay horse figurines, elephants, and hanging bells fired in open pit kilns."
      }
    ],
    "food": {
      "signatureDishes": [
        "Awadhi Dum Biryani",
        "Galouti Kebab",
        "Banarasi Tamatar Chaat",
        "Malaiyyo (Winter Milk Foam)",
        "Bedmi Puri Aloo",
        "Agra Petha"
      ],
      "description": "A grand culinary tapestry uniting royal Awadhi slow-cooking (dum pukht) with sacred street gastronomy from Varanasi ghats."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Ramlila of Ramnagar (UNESCO Intangible Heritage)",
        "Varanasi Ganga Aarti",
        "Braj Lathmar Holi",
        "Ganga-Jamuni Tehzeeb"
      ],
      "description": "The ancient epicentre of Vedic literature, Buddhist monastic debates, and harmonized syncretic courtly manners."
    },
    "songsAndDances": {
      "performingArts": [
        "Kathak (Lucknow Gharana)",
        "Raslila of Vrindavan",
        "Charkula Lamp Dance",
        "Kajari Monsoon Folk Songs",
        "Birha Folk Ballads"
      ],
      "description": "Origin of Kathak classical dance, courtly Thumri expressions, and soulful devotional semi-classical forms."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Banarasi Zari Brocade",
        "Chikankari & Zardozi",
        "Nizamabad Black Pottery",
        "Mirzapur Durries",
        "Saharanpur Wood Carvings"
      ],
      "description": "Unrivaled density of GI-registered craft ecosystems employing over 2 million traditional master artisans."
    },
    "traditionalClothes": {
      "attire": [
        "Banarasi Silk Sarees",
        "Lucknowi Chikan Kurtas",
        "Angrakha Coats",
        "Embroidered Dupattas with Zari"
      ],
      "description": "Regal silks woven with pure bullion metallic zari and cooling white-on-white embroidered fine muslin."
    },
    "spiritualPlaces": {
      "sites": [
        "Kashi Vishwanath Temple (Varanasi)",
        "Ram Janmabhoomi (Ayodhya)",
        "Banke Bihari Temple (Vrindavan)",
        "Triveni Sangam (Prayagraj)",
        "Dhamek Stupa (Sarnath)"
      ],
      "description": "One of the oldest continuously inhabited sacred geographies on earth, venerated by Sanatana Dharma, Buddhism, and Jainism."
    },
    "historicMonuments": {
      "monuments": [
        "Taj Mahal (UNESCO)",
        "Agra Fort (UNESCO)",
        "Fatehpur Sikri (UNESCO)",
        "Bara Imambara (Lucknow)",
        "Chaukhandi Stupa"
      ],
      "description": "Architectural marvels spanning monumental red sandstone forts, ivory-white marble domes, and unsupported arched labyrinth vaults."
    }
  },
  "jammu-and-kashmir": {
    "id": "jammu-and-kashmir",
    "stateName": "Jammu & Kashmir",
    "coordinates": [
      33.7782,
      76.5762
    ],
    "heroImage": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Srinagar",
        "productName": "Pashmina Cashmere Shawls",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Hand-spun Changthangi cashmere goat down woven on traditional wooden loom frames."
      },
      {
        "district": "Budgam",
        "productName": "Kani Shawl (Tujis Technique)",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Coded grid graph (Talim) woven using headless spool needles without shuttle."
      },
      {
        "district": "Anantnag",
        "productName": "Kashmiri Walnut Wood Carving",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Deep relief filigree carved into seasoned mature walnut heartwood without nails."
      },
      {
        "district": "Pulwama",
        "productName": "Kashmir Saffron (Lacha & Mongra)",
        "category": "Agriculture",
        "giTagged": true,
        "description": "High-altitude saffron flowers yielding world-highest crocin potency filaments."
      },
      {
        "district": "Baramulla",
        "productName": "Kashmiri Delicious Apples",
        "category": "Agriculture",
        "giTagged": false,
        "description": "Crisp sweet organic Red Delicious and Ambri apples grown in Himalayan foothills."
      },
      {
        "district": "Ganderbal",
        "productName": "Wicker Willow Baskets & Kangris",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Woven willow reeds boiled, peeled, and hand-plaited into decorative homeware."
      }
    ],
    "food": {
      "signatureDishes": [
        "Wazwan (Rogan Josh, Gushtaba, Rista)",
        "Modur Pulao",
        "Kahwa with Saffron & Almonds",
        "Sheermal Bread",
        "Nadru Yakhni (Lotus Root)"
      ],
      "description": "A 36-course royal celebratory banquet infused with saffron, shallots (pran), dried cockscomb flower, and pure yogurt broths."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Lal Ded Vakhs & Habba Khatoon Poetry",
        "Bhand Pather Folk Theatre",
        "Reshi Sufi Syncretism",
        "Shikara Life on Dal Lake"
      ],
      "description": "The poetic mysticism of Kashmiri Shaivism converging with Sufi saints celebrating oneness with alpine nature."
    },
    "songsAndDances": {
      "performingArts": [
        "Rouf Spring Dance",
        "Hafiza Classical Dance",
        "Kud Dance of Jammu Hills",
        "Sufiana Kalam (Santoor & Sehtar)",
        "Chakri Folk Ballad"
      ],
      "description": "Graceful rhythmic row dance performed by women during harvest festivals, guided by meditative multi-stringed Santoor hymns."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Kani & Pashmina Weaving",
        "Papier-m\u00e2ch\u00e9 Painted Art",
        "Khatamband Geometric Wood Ceilings",
        "Sozni Needle Embroidery",
        "Namda Felted Rugs"
      ],
      "description": "Persian-influenced decorative arts brought along the Silk Route and perfected across generations in Srinagar artisan lanes."
    },
    "traditionalClothes": {
      "attire": [
        "Pheran with Tilla Gold Embroidery",
        "Taranga Headdress",
        "Kasaba Cap",
        "Pashmina Stole"
      ],
      "description": "Long woolen smocks lined with warm insulation, heavily accented around the collar and sleeves with silver bullion wire."
    },
    "spiritualPlaces": {
      "sites": [
        "Shankaracharya Temple (Srinagar)",
        "Mata Vaishno Devi Shrine (Katra)",
        "Hazratbal Dargah",
        "Amarnath Cave Sanctuary",
        "Martand Sun Temple Ruins"
      ],
      "description": "Sacred mountain peaks, miraculous caves, and tranquil lakeside shrines revered across millennia."
    },
    "historicMonuments": {
      "monuments": [
        "Pari Mahal (Palace of Fairies)",
        "Shalimar & Nishat Mughal Terraced Gardens",
        "Hari Parbat Fort",
        "Mubarak Mandi Palace (Jammu)"
      ],
      "description": "Terraced Persian water gardens cascading down Zabarwan hills, stone ramparts, and Dogra royal palace complexes."
    }
  },
  "rajasthan": {
    "id": "rajasthan",
    "stateName": "Rajasthan",
    "coordinates": [
      27.0238,
      74.2179
    ],
    "heroImage": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Jaipur",
        "productName": "Jaipur Blue Pottery",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Quartz powder, Fuller earth, and glass frit glazed without clay, painted in cobalt blue."
      },
      {
        "district": "Jodhpur",
        "productName": "Handcrafted Sheesham Furniture",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Antiquated desert hardwood carved with iron strap work and royal distressed patinas."
      },
      {
        "district": "Barmer",
        "productName": "Ajrakh Block Print Textiles",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Geometric mud-resist double-sided indigo and madder root hand block printing."
      },
      {
        "district": "Bikaner",
        "productName": "Bikaneri Bhujia",
        "category": "Food Processing",
        "giTagged": true,
        "description": "Crisp spicy moth bean flour noodles seasoned with desert spices and fried in groundnut oil."
      },
      {
        "district": "Nagaur",
        "productName": "Makrana Calcite Marble",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Pure white 98% calcite marble quarried from historic Mughal imperial stone beds."
      },
      {
        "district": "Kota",
        "productName": "Kota Doria Handloom Fabric",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Translucent cotton-silk checked (khat) square weaves sized with onion juice and rice paste."
      },
      {
        "district": "Pratapgarh",
        "productName": "Thewa Gold-on-Glass Jewelry",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "23-karat pure gold foil engraved and fused onto colored molten Belgian glass."
      }
    ],
    "food": {
      "signatureDishes": [
        "Dal Baati Churma",
        "Ker Sangri (Desert Berry & Bean)",
        "Laal Maas (Mathania Chilli Mutton)",
        "Gatte ki Sabzi",
        "Ghevar",
        "Pyaaz Kachori"
      ],
      "description": "Desert gastronomy formulated for longevity and valor, celebrated for rich desi ghee, aromatic dried spices, and milk-based gravies."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Pabuji ki Phad Scroll Recitation",
        "Dhola-Maru Ballad Romances",
        "Teej & Gangaur Royal Processions",
        "Desert Nomadic Camel Fairs"
      ],
      "description": "Feudal chivalric codes, oral bardic narrations of deified folk heroes, and vibrant community celebrations."
    },
    "songsAndDances": {
      "performingArts": [
        "Ghoomar Classical Whirl",
        "Kalbelia Cobra Dance (UNESCO)",
        "Bhavai Clay Pot Balancing",
        "Manganiyar & Langa Folk Music (Kamaicha, Khartal)"
      ],
      "description": "Echoing desert vocals accompanied by bowed string Kamaicha and lightning-fast wooden castanets."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Bagru & Sanganeri Block Prints",
        "Blue Pottery",
        "Thewa Jewelry",
        "Meenakari Enameling",
        "Mojari Leather Footwear",
        "Bandhani Tie & Dye"
      ],
      "description": "Vivid rainbow hues extracted from desert minerals and vegetable extracts across thriving generational guilds."
    },
    "traditionalClothes": {
      "attire": [
        "Rajputi Poshak",
        "Bandhani Silk Ghagra Choli",
        "Angrakha with Dhoti",
        "Pachrangi Safa (5-Color Turban)"
      ],
      "description": "Multi-layered pleated skirts spanning 12-meters of fabric paired with gossamer odhnas and royal turbans."
    },
    "spiritualPlaces": {
      "sites": [
        "Brahma Temple (Pushkar)",
        "Karni Mata Temple (Deshnok)",
        "Ajmer Sharif Dargah",
        "Dilwara Jain Temples (Mount Abu)",
        "Shrinathji Temple (Nathdwara)"
      ],
      "description": "The singular sacred lake of Lord Brahma, mystical desert sufi shrines, and intricately carved marble Jain pinnacles."
    },
    "historicMonuments": {
      "monuments": [
        "Mehrangarh Fort (Jodhpur)",
        "Amber Palace (Jaipur)",
        "Hawa Mahal (Palace of Winds)",
        "Jaisalmer Golden Fort",
        "Chittorgarh Fort",
        "Kumbhalgarh Wall"
      ],
      "description": "Impregnable cliff-top citadels rising out of the Thar desert, boasting filigree jali windows and the world second longest fort wall."
    }
  },
  "tamil-nadu": {
    "id": "tamil-nadu",
    "stateName": "Tamil Nadu",
    "coordinates": [
      11.1271,
      78.6569
    ],
    "heroImage": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Kanchipuram",
        "productName": "Kanchipuram Silk Sarees",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Korvai interlocking weft technique bonding body and contrast border with pure silver-gold zari."
      },
      {
        "district": "Thanjavur",
        "productName": "Tanjore Gold Leaf Painting",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "22-karat gold foil embossing with semi-precious Jaipur gemstones on seasoned teak wood."
      },
      {
        "district": "Thanjavur",
        "productName": "Swamimalai Bronze Icons",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Lost-wax (cire perdue) Panchaloha alloy temple idols cast strictly to ancient Silpa Sastras."
      },
      {
        "district": "Madurai",
        "productName": "Madurai Sungudi Tie-Dye Cotton",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Wax-resist dotted circular motifs dyed in natural indigo and plant extracts."
      },
      {
        "district": "Salem",
        "productName": "Salem Silk & Tapioca Sago",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Fine count mulberry silk and premium culinary tapioca starch pearls."
      },
      {
        "district": "Dindigul",
        "productName": "Handcrafted Dindigul Brass Locks",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Unpickable lever security mechanisms forged by generational locksmith guilds."
      }
    ],
    "food": {
      "signatureDishes": [
        "Chettinad Pepper Chicken",
        "Crisp Masala Dosa with Sambar",
        "Ven Pongal with Ghee & Cashews",
        "Kumbakonam Degree Filter Coffee",
        "Idiyappam with Coconut Milk"
      ],
      "description": "Refined spice alchemy balancing hand-pounded black pepper, star anise, curry leaves, fermented rice batters, and aromatic filter coffee."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Sangam Literature Epics (Silappadikaram)",
        "Margazhi Music Festival",
        "Pongal Sun Harvest Thanks",
        "Jallikattu Bull Hugging Valour"
      ],
      "description": "Over 2,500 years of unbroken literary, theatrical, and temple ritual heritage celebrated with deep reverence."
    },
    "songsAndDances": {
      "performingArts": [
        "Bharatanatyam (Classical)",
        "Carnatic Music Kutcheri",
        "Karagattam Water Pot Dance",
        "Kavadi Aattam",
        "Villu Pattu (Bow Song)"
      ],
      "description": "The gold standard of classical Indian rhythm, geometric temple mudras, and divine vocal ragas."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Kanchipuram Silk",
        "Swamimalai Bronze Casting",
        "Tanjore Paintings",
        "Pattamadai Korai Grass Mats",
        "Toda Tribal Embroidery"
      ],
      "description": "Sacred temple guild artistry producing timeless sacred icons, royal silk drapes, and woven cooling reed mats."
    },
    "traditionalClothes": {
      "attire": [
        "Kanchipuram Silk Saree",
        "Veshti (Dhoti) with Angavastram",
        "Pavada Davani (Half Saree)"
      ],
      "description": "Heavy silk sarees woven with temple gopuram motifs and pristine white cotton veshtis bordered in bright metallic thread."
    },
    "spiritualPlaces": {
      "sites": [
        "Brihadisvara Temple (Thanjavur)",
        "Meenakshi Amman Temple (Madurai)",
        "Ramanathaswamy Temple (Rameswaram)",
        "Shore Temple (Mamallapuram)",
        "Arunachaleswarar Agni Temple (Tiruvannamalai)"
      ],
      "description": "Towering granite Gopurams piercing the sky, 1,000-pillared corridors, and sacred cosmic elemental shrines."
    },
    "historicMonuments": {
      "monuments": [
        "Great Living Chola Temples (UNESCO)",
        "Mamallapuram Rock Reliefs (Arjuna Penance)",
        "Thirumalai Nayakkar Palace",
        "Padmanabhapuram Palace",
        "Gingee Fort"
      ],
      "description": "Engineering masterpieces carved directly out of monolithic granite boulders alongside vast dynastic fortresses."
    }
  },
  "kerala": {
    "id": "kerala",
    "stateName": "Kerala",
    "coordinates": [
      10.8505,
      76.2711
    ],
    "heroImage": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Alappuzha",
        "productName": "Coir & Golden Fiber Products",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Retting of coconut husks spun into golden nautical ropes, geometric rugs, and eco-mats."
      },
      {
        "district": "Thrissur",
        "productName": "Aranmula Metal Alloy Mirrors",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Secret copper-tin non-glass front-surface reflective mirror metallurgical alchemy."
      },
      {
        "district": "Wayanad",
        "productName": "Jeerakasala Rice & Robusta Coffee",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Shade-grown rainforest coffee and aromatic short-grain indigenous scented rice."
      },
      {
        "district": "Palakkad",
        "productName": "Palakkadan Matta Red Rice",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Coarse nutrient-dense red parboiled grain grown in rich black palghat clay soils."
      },
      {
        "district": "Idukki",
        "productName": "Green Cardamom & Spices",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Intense flavor Alleppey Green Extra Bold (AGEB) cardamom pods harvested in cloud forests."
      }
    ],
    "food": {
      "signatureDishes": [
        "Kerala Onam Sadya Feast (24 dishes)",
        "Appam with Vegetable Stew",
        "Karimeen Pollichathu (Pearl Spot Fish)",
        "Malabar Mutton Biryani",
        "Puttu & Kadala Curry",
        "Ada Pradhaman"
      ],
      "description": "Tropical spice brilliance dominated by fresh grated coconut, coconut oil, green pepper, curry leaves, and Malabar tamarind (kudampuli)."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Theyyam Deity Invocations",
        "Vallam Kali (Snake Boat Race)",
        "Onam Lore of King Mahabali",
        "Kalaripayattu Martial Ancestry"
      ],
      "description": "Living cult of ancestor worship where performers transcend mortal planes to embody protective deities amidst flaming torches."
    },
    "songsAndDances": {
      "performingArts": [
        "Kathakali Classical Dance Drama",
        "Mohiniyattam (Dance of Enchantress)",
        "Theyyam Ritual Performance",
        "Ottan Thullal Satire",
        "Panchavadyam Temple Percussion"
      ],
      "description": "Elaborate facial mask makeup (vesham), expressive eye movements (navarasas), and deafening chenda drum crescendos."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Aranmula Kannadi Metal Mirrors",
        "Balaramapuram Kasavu Sarees",
        "Mannar Bell Metal Vessels",
        "Coconut Shell Art",
        "Nettur Petti Wooden Jewel Chests"
      ],
      "description": "Rare metallurgical alchemy, fine organic unbleached cotton drapes, and sustainable palm fiber products."
    },
    "traditionalClothes": {
      "attire": [
        "Kasavu Mundum Neriyathum (Gold-bordered Saree)",
        "Mundu with Melmundu"
      ],
      "description": "Pristine off-white handwoven cotton embellished with radiant pure gold metallic zari borders."
    },
    "spiritualPlaces": {
      "sites": [
        "Sree Padmanabhaswamy Temple (Thiruvananthapuram)",
        "Guruvayur Sri Krishna Temple",
        "Sabarimala Sree Ayyappa Temple",
        "Cheraman Juma Mosque (Oldest in India)",
        "St. Francis Church (Kochi)"
      ],
      "description": "Sacred subterranean vaults, oceanfront churches where Vasco da Gama rested, and centuries-old pilgrim trailheads."
    },
    "historicMonuments": {
      "monuments": [
        "Bekal Fort (Kasaragod)",
        "Mattancherry Dutch Palace (Kochi)",
        "Hill Palace Museum (Tripunithura)",
        "Palakkad Fort (Tipu Sultan)"
      ],
      "description": "Coastal sea-facing laterite bastions and wooden royal palaces painted with 16th-century Ramayana murals."
    }
  },
  "karnataka": {
    "id": "karnataka",
    "stateName": "Karnataka",
    "coordinates": [
      15.3173,
      75.7139
    ],
    "heroImage": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Mysuru",
        "productName": "Mysore Silk & Sandalwood Oil",
        "category": "Handlooms",
        "giTagged": true,
        "description": "100% pure silk woven with 0.65% silver and 0.06% real gold zari thread."
      },
      {
        "district": "Bidar",
        "productName": "Bidriware Silver Inlay Metalcraft",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Zinc-copper alloy blackened with historic Bidar fort mud, inlaid with silver foil."
      },
      {
        "district": "Ramanagara",
        "productName": "Channapatna Wooden Lacquer Toys",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Ivory wood turned on lathes and finished with non-toxic natural vegetable lac dyes."
      },
      {
        "district": "Koppal",
        "productName": "Kinhal Painted Wooden Heritage Craft",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Lightweight wood sculpted into sacred vahanas coated with tamarind paste and chalk."
      },
      {
        "district": "Kodagu",
        "productName": "Coorg Arabica Coffee & Wild Honey",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Highland canopy-grown coffee boasting fine citrus acidity and rich aroma."
      },
      {
        "district": "Dharwad",
        "productName": "Dharwad Peda Sweet",
        "category": "Food Processing",
        "giTagged": true,
        "description": "Caramelized reduced buffalo milk khoya rolled in powdered sugar crystals."
      }
    ],
    "food": {
      "signatureDishes": [
        "Bisi Bele Bath",
        "Mysore Pak",
        "Neer Dosa with Mangalorean Ghee Roast",
        "Dharwad Peda",
        "Ragi Mudde with Saaru",
        "Davangere Benne Dosa"
      ],
      "description": "A brilliant culinary balance ranging from fiery coastal seafood ghee roasts to comforting highland ragi balls and aromatic lentil rice."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Mysuru Dasara Jambu Savari",
        "Bhoota Kola Spirit Worship",
        "Yakshagana Night Performances",
        "Vachana Sahitya Philosophical Poetry"
      ],
      "description": "Grand royal elephant processions carrying the golden Chamundeshwari howdah combined with ancient coastal spirit invocation rites."
    },
    "songsAndDances": {
      "performingArts": [
        "Yakshagana Coastal Theatre",
        "Dollu Kunitha Drum Dance",
        "Carnatic Haridasa Kirtanas",
        "Veeragase Martial Dance",
        "Kamsale Cymbal Rhythm"
      ],
      "description": "High-energy acrobatic drum dances, vibrant mythological theatrical costumes, and meditative devotional compositions."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Bidriware Silver Inlay",
        "Mysore Silk",
        "Channapatna Toys",
        "Navalgund Jamkhana Durries",
        "Ganjifa Playing Cards",
        "Kasuti Needle Embroidery"
      ],
      "description": "Royal Vijayanagara and Mysore courtly guilds preserving intricate miniature card painting, stone carving, and geometric needlecraft."
    },
    "traditionalClothes": {
      "attire": [
        "Mysore Silk Saree",
        "Ilkal Saree with Kasuti Embroidery",
        "Panche (Dhoti)",
        "Mysuru Peta (Embroidered Turban)"
      ],
      "description": "Lustrous solid-shade silk sarees paired with ceremonial royal turbans rimmed in glittering golden ribbon."
    },
    "spiritualPlaces": {
      "sites": [
        "Virupaksha Temple (Hampi)",
        "Murudeshwar Shiva Temple",
        "Gommateshwara Monolith (Shravanabelagola)",
        "Chamundeshwari Temple (Mysuru)",
        "Udupi Sri Krishna Matha"
      ],
      "description": "The world tallest monolithic free-standing stone statue of Lord Bahubali, rock-cut caverns, and living riverside sanctums."
    },
    "historicMonuments": {
      "monuments": [
        "Group of Monuments at Hampi (UNESCO)",
        "Badami Cave Temples",
        "Gol Gumbaz Whispering Gallery (Bijapur)",
        "Pattadakal (UNESCO)",
        "Mysore Amba Vilas Palace"
      ],
      "description": "Vast capital ruins of the Vijayanagara Empire, Chalukyan rock-cut caves, and the world second-largest unsupported dome."
    }
  },
  "maharashtra": {
    "id": "maharashtra",
    "stateName": "Maharashtra",
    "coordinates": [
      19.7515,
      75.7139
    ],
    "heroImage": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Aurangabad",
        "productName": "Paithani Silk & Zari Sarees",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Handcrafted oblique square tapestry technique with peacock (mor) pallu motifs."
      },
      {
        "district": "Ratnagiri",
        "productName": "Alphonso (Hapus) Mangoes",
        "category": "Agriculture",
        "giTagged": true,
        "description": "The undisputed king of mangoes, celebrated for saffron pulp, low fiber, and sweet fragrance."
      },
      {
        "district": "Kolhapur",
        "productName": "Kolhapuri Leather Chappals",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Hand-stitched vegetable-tanned buffalo and goat leather sandals dyed with natural extracts."
      },
      {
        "district": "Solapur",
        "productName": "Solapur Chaddar & Terry Towels",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Heavy jacquard woven cotton bed coverings famous for long-lasting durability."
      },
      {
        "district": "Palghar",
        "productName": "Warli Tribal Wall Paintings",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Rice paste geometric symbols on mud-ochre plaster depicting circle of life."
      }
    ],
    "food": {
      "signatureDishes": [
        "Puran Poli",
        "Misal Pav with Kat Gravy",
        "Vada Pav",
        "Pithla Bhakri with Thecha",
        "Bombil Fry",
        "Modak"
      ],
      "description": "From fiery Kolhapuri rassa and pungent green-chilli thechas to fragrant saffron-cardamom sweetened lentil flatbreads."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Ganeshotsav Community Festivities",
        "Warkari Pandharpur Palkhi Pilgrimage",
        "Shivaji Maharaj Ballad Lore (Powada)",
        "Dahi Handi Formations"
      ],
      "description": "The egalitarian saintly movement of Tukaram and Dnyaneshwar uniting millions of pilgrims chanting on foot across monsoon plains."
    },
    "songsAndDances": {
      "performingArts": [
        "Lavani Rhythmic Folk Dance",
        "Powada Heroic Ballad",
        "Koli Fisherfolk Dance",
        "Tamasha Folk Theatre",
        "Gondhal Ritual"
      ],
      "description": "Passionate ankle-bell rhythms set to the dholki drum and martial historical chronicles sung by wandering Shahir bards."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Paithani Weaving",
        "Warli Paintings",
        "Kolhapuri Leather Craft",
        "Sawantwadi Lacquer Toys",
        "Bidri Brasswork of Aurangabad"
      ],
      "description": "Peacock-motif gold-bordered sarees, tribal mud paintings, and hand-braided heritage footwear."
    },
    "traditionalClothes": {
      "attire": [
        "Nauvari (Nine-Yard) Saree",
        "Dhoti with Kurta & Pagdi",
        "Kolhapuri Saaj Necklace",
        "Fheta (Turban)"
      ],
      "description": "Trouser-style draped nine-yard silk sarees allowing agile movement, crowned by golden crescent nose studs (nath)."
    },
    "spiritualPlaces": {
      "sites": [
        "Shirdi Sai Baba Sansthan",
        "Trimbakeshwar Jyotirlinga (Nashik)",
        "Vithoba Temple (Pandharpur)",
        "Siddhivinayak Temple (Mumbai)",
        "Mahalaxmi Temple (Kolhapur)"
      ],
      "description": "Sacred Jyotirlinga shrines where the Godavari river emerges alongside the spiritual heart of the Warkari movement."
    },
    "historicMonuments": {
      "monuments": [
        "Ajanta & Ellora Caves (UNESCO)",
        "Raigad Hill Fort (Chhatrapati Shivaji Capital)",
        "Gateway of India (Mumbai)",
        "Chhatrapati Shivaji Maharaj Terminus (UNESCO)",
        "Daulatabad Fort"
      ],
      "description": "Monolithic rock-carved Kailash Temple cut out of a single cliff, alongside rugged Sahyadri mountain fortifications."
    }
  },
  "gujarat": {
    "id": "gujarat",
    "stateName": "Gujarat",
    "coordinates": [
      22.2587,
      71.1924
    ],
    "heroImage": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Patan",
        "productName": "Patan Patola Double Ikat",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Silk warp and weft dyed independently prior to weaving; completely reversible matching design."
      },
      {
        "district": "Kutch",
        "productName": "Rogan Painting on Fabric",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Boiled castor seed oil base pigment applied with a blunt metal stylus needle on cloth."
      },
      {
        "district": "Junagadh",
        "productName": "Gir Kesar Mango",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Bright orange flesh sweet mango grown in the volcanic foothills of Mount Girnar."
      },
      {
        "district": "Rajkot",
        "productName": "Rajkot Single Ikat & Silver Filigree",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Artisanal patterned silk weaves and gossamer twisted silver jewelry."
      },
      {
        "district": "Surendranagar",
        "productName": "Tangaliya Shawls & Fabrics",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Raised dotted bead-like geometric motifs woven onto coarse sheep wool."
      }
    ],
    "food": {
      "signatureDishes": [
        "Gujarati Thali (Kadhi, Shaak, Rotli)",
        "Khaman Dhokla",
        "Undhiyu with Puri & Jalebi",
        "Thepla with Chhundo",
        "Fafda Jalebi",
        "Handvo"
      ],
      "description": "A delicate harmony of sweet, salty, and sour notes, starring slow-cooked clay-pot winter greens and fermented chickpea savory cakes."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Navratri Garba Festivities (UNESCO)",
        "Rann Utsav White Salt Desert Celebrations",
        "International Kite Festival (Uttarayan)",
        "Dwaraka Krishna Pilgrimage Lore"
      ],
      "description": "Nine consecutive nights of ecstatic circular community dancing honoring feminine divine power under moonlit skies."
    },
    "songsAndDances": {
      "performingArts": [
        "Garba Circular Folk Dance",
        "Dandiya Raas with Sticks",
        "Bhavai Folk Theatre (Vesha)",
        "Dayro Vocal Storytelling",
        "Tippani Dance of Chorwad"
      ],
      "description": "Swirling hand-clapping and polished wood stick collisions syncing to high-tempo dhol rhythms and folk bards."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Patan Patola",
        "Ajrakh Mud-Resist Block Print",
        "Kutch Kutchi Mirror Embroidery",
        "Rogan Art",
        "Sankheda Lacquered Teak Furniture",
        "Bandhani"
      ],
      "description": "Unmatched textile virtuosity spanning intricate mirror-work tapestries, mud-painted Lippan walls, and double-dyed ikats."
    },
    "traditionalClothes": {
      "attire": [
        "Chaniya Choli with Abhala (Mirrorwork)",
        "Kediyu with Chorno (Gathered Trousers)",
        "Bandhani Dupatta",
        "Mojadi"
      ],
      "description": "Flared heavily embroidered skirts accented with hundreds of tiny mirrors that catch festive light at night."
    },
    "spiritualPlaces": {
      "sites": [
        "Somnath Jyotirlinga Temple",
        "Dwarkadhish Temple (Dwaraka)",
        "Palitana Jain Temples (Shatrunjaya Hills)",
        "Sun Temple (Modhera)",
        "Akshardham (Gandhinagar)"
      ],
      "description": "Ancient sea-facing Jyotirlinga citadels, sacred Krishna kingdoms, and 800+ marble Jain temples crowning holy hilltops."
    },
    "historicMonuments": {
      "monuments": [
        "Rani ki Vav Queen Stepwell (UNESCO)",
        "Statue of Unity (World Tallest Statue)",
        "Historic City of Ahmadabad (UNESCO)",
        "Champaner-Pavagadh (UNESCO)",
        "Laxmi Vilas Palace (Vadodara)"
      ],
      "description": "Subterranean stepwells engineered seven stories deep with 500 principal sculptures, and vast Indo-Saracenic royal palaces."
    }
  },
  "west-bengal": {
    "id": "west-bengal",
    "stateName": "West Bengal",
    "coordinates": [
      22.9868,
      87.855
    ],
    "heroImage": "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Darjeeling",
        "productName": "Darjeeling Orthodox Tea",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Champagne of Teas boasting natural muscatel flavor harvested in Himalayan cloud mists."
      },
      {
        "district": "Birbhum",
        "productName": "Nakshi Kantha Embroidery",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Running stitch storytelling on upcycled layered fabrics depicting village folklore."
      },
      {
        "district": "Bankura",
        "productName": "Bankura Terracotta Horses",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Symmetrical tall-eared clay terracotta horses fired in traditional village ovens."
      },
      {
        "district": "Bankura",
        "productName": "Baluchari Silk Sarees",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Jacquard woven pallu panels narrating scenes from the Mahabharata and Ramayana."
      },
      {
        "district": "Nadia",
        "productName": "Santipore & Phulia Cotton Sarees",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Feather-light soft muslin cotton woven with fine combed counts."
      },
      {
        "district": "Purulia",
        "productName": "Purulia Chhau Masks",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Paper pulp and clay painted warrior masks adorned with feathers and tinsel."
      }
    ],
    "food": {
      "signatureDishes": [
        "Shorshe Ilish (Hilsa in Mustard Gravy)",
        "Kosha Mangsho with Luchi",
        "Bengali Rasgulla & Sandesh",
        "Macher Jhol",
        "Chingri Malai Curry",
        "Mishti Doi"
      ],
      "description": "A legendary culinary philosophy celebrating the punch of mustard oil, five-spice panch phoron, freshwater fish, and syrup-soaked cottage cheese sweets."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Durga Puja Festivities (UNESCO)",
        "Baul Mystic Minstrels of Kenduli Mela",
        "Rabindra Sangeet & Shantiniketan Poush Mela",
        "Kalighat Patachitra Storytelling"
      ],
      "description": "Grand public art installations across Durga Puja pandals combined with wandering Baul philosophers singing of the inner soul."
    },
    "songsAndDances": {
      "performingArts": [
        "Purulia Chhau Martial Mask Dance",
        "Baul Folk Song with Ektara & Dubki",
        "Rabindra Nritya Classical Dance",
        "Bhatiyali Boatman Songs",
        "Jhumur"
      ],
      "description": "Acrobatic somersault martial dances reenacting cosmic warfare, and mournful boatman ballads floating along broad Bengal rivers."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Baluchari Silk",
        "Jamdani Weaving",
        "Nakshi Kantha",
        "Bankura Terracotta",
        "Dokra Brass Metal Casting of Bikna",
        "Purulia Chhau Masks"
      ],
      "description": "Tapestry-like pictorial silk sarees, bell metal lost-wax figures, and generational needlepoint storytelling."
    },
    "traditionalClothes": {
      "attire": [
        "Tant Cotton Saree with Lal-Par (Red Border)",
        "Baluchari Saree",
        "Kurta with Pleated Dhoti (Dhoti-Panjabi)",
        "Garad Silk"
      ],
      "description": "Crisp white cotton sarees bordered in scarlet red worn during Sindoor Khela alongside pure tussar silk drapes."
    },
    "spiritualPlaces": {
      "sites": [
        "Kalighat Kali Temple (Kolkata)",
        "Dakshineswar Kali Temple",
        "Belur Math (Ramakrishna Mission HQ)",
        "Mayapur ISKCON Chandrodaya Temple",
        "Tarapith Shaktipeeth"
      ],
      "description": "Powerful Shaktipeeth sanctuaries where Ramakrishna Paramahamsa and Swami Vivekananda experienced spiritual awakening."
    },
    "historicMonuments": {
      "monuments": [
        "Victoria Memorial (Kolkata)",
        "Howrah Cantilever Bridge",
        "Bishnupur Terracotta Temples (Pancha Ratna)",
        "Hazarduari Palace (Murshidabad)",
        "Adina Mosque Ruins"
      ],
      "description": "Intricately molded burnt-brick terracotta temples of the Malla kings, alongside British imperial white marble edifices."
    }
  },
  "odisha": {
    "id": "odisha",
    "stateName": "Odisha",
    "coordinates": [
      20.9517,
      85.0985
    ],
    "heroImage": "https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Puri",
        "productName": "Pattachitra Palm Leaf Painting",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Etched dried palm leaf (Tala Pattachitra) with natural lamp-black ink and mineral colors."
      },
      {
        "district": "Sambalpur",
        "productName": "Sambalpuri Bandha Tie-Dye Silk",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Warp and weft tied and dyed before weaving with iconic shankha, chakra, and phula motifs."
      },
      {
        "district": "Cuttack",
        "productName": "Tarakasi Silver Filigree",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Fine strands of pure silver drawn, curled, and soldered into jewelry and miniature chariots."
      },
      {
        "district": "Puri",
        "productName": "Pipili Applique Craft (Chandua)",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Layered cloth patches stitched to create vibrant temple umbrellas and canopies."
      },
      {
        "district": "Kandhamal",
        "productName": "Kandhamal Haldi (Organic Turmeric)",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Golden organic turmeric cultivated by Dongria Kondh indigenous mountain communities."
      }
    ],
    "food": {
      "signatureDishes": [
        "Pakhala Bhata with Badi Chura",
        "Chhena Poda (Caramelized Baked Cheese Cake)",
        "Dalma (Lentil with Root Vegetables)",
        "Odisha Rasagola (GI Tagged)",
        "Macha Besara (Fish in Mustard Paste)"
      ],
      "description": "Temple culinary devotion anchored around Jagannath Mahaprasad, subtle mustard pungency, and the world first caramel baked cheese dessert."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Puri Jagannath Ratha Yatra",
        "Chandan Yatra Water Festival",
        "Boita Bandana Maritime Commemoration",
        "Dola Purnima"
      ],
      "description": "The monumental chariot festival carrying Lord Jagannath, Balabhadra, and Subhadra along millions of singing pilgrims."
    },
    "songsAndDances": {
      "performingArts": [
        "Odissi Classical Dance (Tribhanga Posture)",
        "Gotipua Acrobatic Temple Dance",
        "Chhau Dance of Mayurbhanj",
        "Pala and Daskathia Folk Recitals"
      ],
      "description": "Sculpturesque classical dance inspired by Konark temple relief friezes, embodying sensual devotion."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Pattachitra Painting",
        "Sambalpuri & Bomkai Sarees",
        "Cuttack Silver Filigree",
        "Pipili Applique",
        "Dhokra Casting of Dhenkanal",
        "Stone Carving"
      ],
      "description": "Ancient lineages of Chitrakar painters and Master weavers creating intricate curvilinear tie-dye warp designs."
    },
    "traditionalClothes": {
      "attire": [
        "Sambalpuri Ikat Saree",
        "Bomkai Saree",
        "Khandua Pata Temple Silk",
        "Dhoti with Angavastra"
      ],
      "description": "Sacred red-and-yellow silks inscribed with calligraphic Gita Govinda verses woven for temple deities."
    },
    "spiritualPlaces": {
      "sites": [
        "Shree Jagannath Temple (Puri)",
        "Konark Sun Temple (UNESCO)",
        "Lingaraj Temple (Bhubaneswar)",
        "Taratarini Shaktipeeth",
        "Dhauli Shanti Stupa"
      ],
      "description": "The supreme abode of the Lord of the Universe alongside emperor Ashoka stone rock edicts that heralded Buddhism."
    },
    "historicMonuments": {
      "monuments": [
        "Konark Sun Temple Chariot Wheels",
        "Udayagiri & Khandagiri Jain Caves",
        "Barabati Fort Ruins (Cuttack)",
        "Khiching Kichakeshwari Temple"
      ],
      "description": "A gigantic cosmic stone chariot carved with 24 sun wheels functioning as precise astronomical sundials."
    }
  },
  "andhra-pradesh": {
    "id": "andhra-pradesh",
    "stateName": "Andhra Pradesh",
    "coordinates": [
      15.9129,
      79.74
    ],
    "heroImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Krishna",
        "productName": "Machilipatnam Kalamkari Hand Block Print",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Vegetable dyes applied with carved wooden blocks depicting Persian trees of life."
      },
      {
        "district": "Krishna",
        "productName": "Kondapalli Toys (Bommalu)",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Lightweight Tella Poniki softwood hand-carved and painted with tamarind seed paste."
      },
      {
        "district": "East Godavari",
        "productName": "Uppada Jamdani Cotton & Silk Sarees",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Non-mechanical geometric zari insertion weft technique creating featherlight drapes."
      },
      {
        "district": "Chittoor",
        "productName": "Tirupati Laddu (Srivari Prasadam)",
        "category": "Food Processing",
        "giTagged": true,
        "description": "Gram flour boondi fried in pure cow ghee and bound with sugar candy, raisins, and cardamoms."
      },
      {
        "district": "Guntur",
        "productName": "Guntur Sannam Chilli",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Fiery red pungent sun-dried chillies with intense capsaicin and deep natural red oleoresin."
      }
    ],
    "food": {
      "signatureDishes": [
        "Gongura Pachadi (Sorrel Leaf Chutney)",
        "Andhra Fiery Royyala Iguru (Prawn Fry)",
        "Pesarattu with Ginger Chutney",
        "Pootharekulu (Paper Sweet)",
        "Ulava Charu (Horsegram Soup)"
      ],
      "description": "Renowned as India most fiery cuisine, driven by Guntur chillies, tangy sour gongura leaves, and delicate paper-thin rolled sweets."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Tirupati Brahmotsavam Festival",
        "Lepakshi Temple Bas-Relief Legends",
        "Kuchipudi Natyam Bhagavatulu",
        "Sankranti Haridasu Chants"
      ],
      "description": "Ancient dance-drama village traditions dedicated to Lord Krishna, and towering hilltop pilgrim processions."
    },
    "songsAndDances": {
      "performingArts": [
        "Kuchipudi Classical Dance (Brass plate Tarangam)",
        "Annamacharya Sankirtanas",
        "Bhamakalapam Dance Drama",
        "Tappeta Gullu Folk Dance"
      ],
      "description": "Dancers balancing brass plates and water pots on heads while executing intricate rhythmic footwork."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Machilipatnam Kalamkari",
        "Kondapalli Toys",
        "Dharmavaram Silk Sarees",
        "Venkatagiri Fine Cotton",
        "Etikoppaka Lacquer Toys",
        "Budithi Brassware"
      ],
      "description": "Naturally lacquered wooden baby toys, pen-drawn tree-of-life tapestries, and gold-brocaded temple silks."
    },
    "traditionalClothes": {
      "attire": [
        "Dharmavaram Silk Saree",
        "Uppada Jamdani Saree",
        "Panchi with Kanduva (Dhoti & Stole)"
      ],
      "description": "Broad double-colored gold zari borders paired with fine translucent body weave."
    },
    "spiritualPlaces": {
      "sites": [
        "Tirumala Venkateswara Temple (Tirupati)",
        "Mallikarjuna Jyotirlinga (Srisailam)",
        "Veerabhadra Temple (Lepakshi)",
        "Kanaka Durga Temple (Vijayawada)",
        "Simhachalam Temple"
      ],
      "description": "The world most visited Hindu pilgrimage sanctuary, alongside the mysterious Hanging Pillar of Lepakshi."
    },
    "historicMonuments": {
      "monuments": [
        "Lepakshi Monolithic Nandi",
        "Chandragiri Fort (Vijayanagara Capital)",
        "Undavalli Rock-Cut Caves",
        "Kondapalli Fort Ruins",
        "Amaravati Buddhist Stupa Site"
      ],
      "description": "India largest monolithic granite Nandi bull, and four-story cave monasteries carved out of solid sandstone hills."
    }
  },
  "telangana": {
    "id": "telangana",
    "stateName": "Telangana",
    "coordinates": [
      18.1124,
      79.0193
    ],
    "heroImage": "https://images.unsplash.com/photo-1572455044327-7348c1be7267?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Yadadri Bhuvanagiri",
        "productName": "Pochampally Ikat Silk Sarees",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Geometric tie-and-dye warp-weft transfer weaving (Pagas) creating sharp diamond patterns."
      },
      {
        "district": "Nalgonda",
        "productName": "Telia Rumal Oily Double Ikat",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Yarn conditioned in castor and gingelly oil for months, woven into red, black, and white cloths."
      },
      {
        "district": "Nirmal",
        "productName": "Nirmal Lacquer Paintings & Wooden Toys",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Soft Poniki wood coated with herbal lac and gold powder painting portraying birds and flora."
      },
      {
        "district": "Warangal",
        "productName": "Warangal Cotton & Jute Dhurries",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Interlocking geometric wave motifs woven on horizontal pit looms."
      },
      {
        "district": "Jangaon",
        "productName": "Cheriyal Scroll Paintings & Masks",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Khadi cloth coated with tamarind seed paste and chalk, painted with red narrative folk panels."
      }
    ],
    "food": {
      "signatureDishes": [
        "Hyderabadi Dum Biryani",
        "Mirchi ka Salan",
        "Hyderabadi Haleem (GI Tagged)",
        "Sarva Pindi (Crisp Rice Cake)",
        "Sakinalu Sesame Rings",
        "Double ka Meetha"
      ],
      "description": "Deccan Nizami grandeur blended with rustic Telangana spices, celebrated for slow-simmered wheat-meat porridge and clay-baked rice pancakes."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Bonalu Goddess Mahakali Festival",
        "Bathukamma Floral Festival",
        "Sammakka Saralamma Jatara (Largest Tribal Gathering)",
        "Deccan Urdu Courtly Poetry"
      ],
      "description": "Towering floral cone offerings crafted by women honoring nature, alongside biennial tribal forest gatherings of 10 million pilgrims."
    },
    "songsAndDances": {
      "performingArts": [
        "Perini Sivatandavam (Warrior Dance)",
        "Oggu Katha Ballad Storytelling",
        "Gussadi Dance of Raj Gonds",
        "Dappu Drum Rhythm",
        "Qawwali"
      ],
      "description": "Kakatiya-era warrior dance performed before entering battle, and energetic tribal dances with peacock feather crowns."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Pochampally Ikat",
        "Telia Rumal",
        "Nirmal Paintings",
        "Cheriyal Scrolls",
        "Bidri Craft of Hyderabad",
        "Dokra of Adilabad"
      ],
      "description": "Heritage oil-conditioned double ikats, vivid story scrolls, and geometric floor rugs."
    },
    "traditionalClothes": {
      "attire": [
        "Pochampally Ikat Silk Saree",
        "Gadwal Saree",
        "Kurta Pajama with Sherwani",
        "Dhoti with Kanduva"
      ],
      "description": "Intricate geometric double-ikat sarees paired with majestic royal Deccani sherwanis."
    },
    "spiritualPlaces": {
      "sites": [
        "Ramappa Temple (Kakatiya Rudreshwara, UNESCO)",
        "Yadagirigutta Lakshmi Narasimha Temple",
        "Bhadrachalam Rama Temple",
        "Kaleshwaram Mukteshwara Temple",
        "Mecca Masjid (Hyderabad)"
      ],
      "description": "Floating brick temple marvels engineered to withstand seismic shocks, and sacred riverside Jyotirlingas."
    },
    "historicMonuments": {
      "monuments": [
        "Golconda Fort & Whispering Diamond Vaults",
        "Charminar (Hyderabad Symbol)",
        "Qutb Shahi Tombs Complex",
        "Chowmahalla Palace",
        "Warangal Fort Gateway (Kakatiya Kala Thoranam)"
      ],
      "description": "Massive acoustic granite fortresses that yielded the Koh-i-Noor diamond, alongside arched minarets."
    }
  },
  "assam": {
    "id": "assam",
    "stateName": "Assam",
    "coordinates": [
      26.2006,
      92.9376
    ],
    "heroImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Kamrup",
        "productName": "Assam Muga Golden Silk",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Naturally lustrous golden silk from endemic Antheraea assamensis silkworms that shines brighter with every wash."
      },
      {
        "district": "Majuli",
        "productName": "Majuli Island Mask Making & Pottery",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Bamboo, clay, and cow-dung theatrical masks (Mukha) depicting mythological characters."
      },
      {
        "district": "Barpeta",
        "productName": "Sarthebari Bell Metal Craft",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Hand-beaten copper-tin alloy plates (Kahi) and ceremonial presentation stands (Xorai)."
      },
      {
        "district": "Golaghat",
        "productName": "Assam Orthodox & CTC Black Tea",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Malty, full-bodied rich black tea cultivated in the Brahmaputra valley flood plains."
      },
      {
        "district": "Cachar",
        "productName": "Cane & Bamboo Utility Crafts",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Flexible cane split, treated, and woven into furniture, baskets, and fishing traps."
      }
    ],
    "food": {
      "signatureDishes": [
        "Masor Tenga (Tangy Fish Curry with Elephant Apple)",
        "Khaar (Alkaline Raw Papaya & Banana Ash)",
        "Duck Meat with Ash Gourd",
        "Pitha (Rice Cakes with Sesame)",
        "Alu Pitika",
        "Jolpan with Cream & Jaggery"
      ],
      "description": "Fresh, herbaceous, and minimally spiced gastronomy celebrating wild green ferns (dhekia), bamboo shoots, and cooling sour fish broths."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Bihu Agricultural Seasonal Festivities",
        "Srimanta Sankardeva Neo-Vaishnavite Satra Culture",
        "Ambubachi Mela of Kamakhya",
        "Majuli Island Monastic Life"
      ],
      "description": "Living riverine monastic satras preserving 500 years of unbroken dance, theater, mask-making, and devotional singing."
    },
    "songsAndDances": {
      "performingArts": [
        "Sattriya Classical Dance (UNESCO)",
        "Bihu Spring Dance with Pepa Horn & Dhol",
        "Borgeet Devotional Hymns",
        "Ojapali Ancient Storytelling"
      ],
      "description": "Sensual rhythmic hip sways and rapid hand gestures to the wailing melody of the buffalo horn pipe (pepa)."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Muga & Eri (Peace) Silk Weaving",
        "Majuli Masks",
        "Sarthebari Bell Metal",
        "Jaapi Bamboo Conical Hats",
        "Terracotta of Asharikandi"
      ],
      "description": "Golden royal silks woven on village throw-shuttle looms, alongside woven conical sun-shade headgear."
    },
    "traditionalClothes": {
      "attire": [
        "Mekhela Chador (Muga Golden Silk)",
        "Gamosa Cotton Towel with Red Embroidery",
        "Dhoti with Kurta"
      ],
      "description": "Two-piece shimmering golden silk drapes, paired with the iconic sacred handwoven red-and-white Gamosa."
    },
    "spiritualPlaces": {
      "sites": [
        "Maa Kamakhya Temple (Guwahati, Tantric Shaktipeeth)",
        "Umananda Peacock Island Shiva Temple",
        "Dakhinpat Satra (Majuli)",
        "Hajo Hayagriva Madhava Temple",
        "Basistha Ashram"
      ],
      "description": "The supreme cradle of Kamakhya Tantric spirituality, perched atop Nilachal hill overlooking the mighty Brahmaputra."
    },
    "historicMonuments": {
      "monuments": [
        "Rang Ghar (Asia Oldest Royal Amphitheatre)",
        "Talatal Ghar (Ahom Underground Citadel)",
        "Kareng Ghar (Garhgaon Palace)",
        "Sivasagar Sivadol Temple",
        "Charaideo Moidams (UNESCO)"
      ],
      "description": "Pyramidal royal burial mounds (Moidams) of the Ahom kings, and curved brick amphitheaters where kings watched buffalo fights."
    }
  },
  "punjab": {
    "id": "punjab",
    "stateName": "Punjab",
    "coordinates": [
      31.1471,
      75.3412
    ],
    "heroImage": "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Amritsar",
        "productName": "Amritsari Wadian & Papad",
        "category": "Food Processing",
        "giTagged": true,
        "description": "Sun-dried spiced black lentil nuggets and hand-rolled crisp wafers seasoned with hing."
      },
      {
        "district": "Patiala",
        "productName": "Phulkari Hand Embroidery",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Darn-stitch silk thread embroidery on coarse hand-spun khaddar fabric."
      },
      {
        "district": "Jalandhar",
        "productName": "Sports Goods Manufacturing",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "English willow cricket bats, leather footballs, and Olympic hockey gear."
      },
      {
        "district": "Muktsar",
        "productName": "Muktsari Handcrafted Juttis",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Fine leather slip-on shoes embroidered with silk and metallic zari wire."
      }
    ],
    "food": {
      "signatureDishes": [
        "Makki di Roti & Sarson da Saag",
        "Amritsari Kulcha with Chole",
        "Butter Chicken",
        "Langar Wali Dal with Roti",
        "Lassi in Clay Kulhad",
        "Pinni"
      ],
      "description": "Robust agrarian warmth fueled by fresh churned white butter, slow-simmered mustard greens, and tandoor-roasted flatbreads."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Langar Seva (Universal Free Kitchen)",
        "Baisakhi Harvest Festival",
        "Heer Ranjha and Mirza Sahiban Epics",
        "Hola Mohalla Martial Games"
      ],
      "description": "The egalitarian Sikh ethos of selfless service (seva) feeding all regardless of caste, alongside fierce warrior celebrations."
    },
    "songsAndDances": {
      "performingArts": [
        "Bhangra Harvest Celebration",
        "Giddha Women Folk Dance",
        "Dhadhi Jatha Bardic Singing",
        "Tappa and Boliyan Folk Rhymes"
      ],
      "description": "Explosive energy propelled by the double-headed dhol drum, chimta tongs, and joyous agrarian footwork."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Phulkari Embroidered Shawls",
        "Amritsari Juttis",
        "Thathera Metal Craft of Jandiala Guru (UNESCO)",
        "Mud-Plastered Grain Bins (Pehra)"
      ],
      "description": "UNESCO-recognized traditional brass and copper utensil beating techniques preserved in Jandiala Guru."
    },
    "traditionalClothes": {
      "attire": [
        "Phulkari Dupatta with Patiala Salwar Suit",
        "Kurta Pajama with Pagri (Turban)",
        "Tehmat (Lungi)"
      ],
      "description": "Bright mustard, saffron, and fuchsia drapes embroidered from the reverse side with untwisted silk floss (pat)."
    },
    "spiritualPlaces": {
      "sites": [
        "Sri Harmandir Sahib (Golden Temple, Amritsar)",
        "Takht Sri Damdama Sahib",
        "Takht Sri Keshgarh Sahib (Anandpur Sahib)",
        "Durgiana Temple",
        "Fatehgarh Sahib Gurdwara"
      ],
      "description": "The golden sanctuary resting in the center of the Amrit Sarovar lake, echoing with continuous hymns of Gurbani."
    },
    "historicMonuments": {
      "monuments": [
        "Jallianwala Bagh Memorial",
        "Qila Mubarak (Bathinda)",
        "Sheesh Mahal (Patiala)",
        "Gobindgarh Fort (Amritsar)",
        "Wagah Border Amphitheatre"
      ],
      "description": "Ancient brick forts where Razia Sultan was detained alongside poignant freedom struggle memorial grounds."
    }
  },
  "haryana": {
    "id": "haryana",
    "stateName": "Haryana",
    "coordinates": [
      29.0588,
      76.0856
    ],
    "heroImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Panipat",
        "productName": "Panipat Handloom Weaving & Rugs",
        "category": "Handlooms",
        "giTagged": false,
        "description": "Historic textile center producing durable wool blankets, durries, and recycled yarns."
      },
      {
        "district": "Rewari",
        "productName": "Rewari Brass Metalware & Tilli Jutti",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Traditional sand-cast brass cooking pots and copper vessels."
      },
      {
        "district": "Karnal",
        "productName": "Basmati Rice Processing",
        "category": "Agriculture",
        "giTagged": false,
        "description": "Long-grain aromatic basmati paddy milled, aged, and graded for fine dining."
      }
    ],
    "food": {
      "signatureDishes": [
        "Bajra Khichdi with Desi Ghee",
        "Kadhi Pakora",
        "Hara Dhania Cholia",
        "Ghevar Sweet",
        "Kachri ki Sabzi",
        "Lassi & Makkhan"
      ],
      "description": "Wholesome peasant sustenance rooted in rich milk, home-churned butter, pearl millet flatbreads, and wild desert cucumbers."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Mahabharata Kurukshetra Lore",
        "Surajkund International Crafts Mela",
        "Haryanvi Ragini Singing",
        "Pehelwani Wrestling Akhadas"
      ],
      "description": "The sacred battlefield where Lord Krishna delivered the Bhagavad Gita, combined with ancient mud akhada wrestling culture."
    },
    "songsAndDances": {
      "performingArts": [
        "Saang Musical Folk Theatre",
        "Dhamal Dance of Ahirwal",
        "Khoria Wedding Dance",
        "Phag Spring Dance",
        "Ragini Folk Opera"
      ],
      "description": "Open-air musical theatre enacted on wooden platforms, set to nagada drums and bansuri flutes."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Panipat Durries and Blankets",
        "Rewari Brass Craft",
        "Jharokha Wood Carving",
        "Leather Tilli Jutti"
      ],
      "description": "Sturdy handloom floor coverings, sand-cast heavy brass pots, and intricate wood carving."
    },
    "traditionalClothes": {
      "attire": [
        "Dhaman (Flared Skirt) with Kurti & Chunder",
        "Dhoti Kurta with Khandwa Turban"
      ],
      "description": "Heavy pleated skirts fashioned from up to 20 meters of sturdy fabric with silver gotapatti embroidery."
    },
    "spiritualPlaces": {
      "sites": [
        "Brahma Sarovar (Kurukshetra)",
        "Jyotisar (Site of Bhagavad Gita)",
        "Mata Mansa Devi Temple (Panchkula)",
        "Sheetla Mata Mandir (Gurugram)"
      ],
      "description": "Expansive holy water reservoirs where millions gather during solar eclipses, and the immortal banyan tree of Jyotisar."
    },
    "historicMonuments": {
      "monuments": [
        "Sheikh Chilli Tomb (Thanesar)",
        "Rakhigarhi Indus Valley Archaeological Site",
        "Asigarh Fort (Hansi)",
        "Pinjore Yadavindra Mughal Gardens"
      ],
      "description": "Massive excavated mounds of the largest Harappan city civilization dating back over 5,000 years."
    }
  },
  "himachal-pradesh": {
    "id": "himachal-pradesh",
    "stateName": "Himachal Pradesh",
    "coordinates": [
      31.1048,
      77.1734
    ],
    "heroImage": "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Kullu",
        "productName": "Kullu Woolen Shawl",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Geometric dovetail patterns woven on fine merino and pashmina wool loom frames."
      },
      {
        "district": "Kangra",
        "productName": "Kangra Orthodox Green & Black Tea",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Sweet liquor aromatic tea cultivated under the misty Dhauladhar mountains."
      },
      {
        "district": "Chamba",
        "productName": "Chamba Rumal Needle Embroidery",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Double-sided satin stitch (Dorukha) needle painting with identical finish on both sides."
      },
      {
        "district": "Kinnaur",
        "productName": "Kinnauri Woolen Shawls & Apples",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Intricate Buddhist religious symbolism woven into heavy mountain sheep wool."
      }
    ],
    "food": {
      "signatureDishes": [
        "Himachali Dham (Madra, Babru, Mah Dal)",
        "Siddu with Desi Ghee",
        "Chha Gosht",
        "Kullu Trout Fish Fry",
        "Mittha Sweet Rice"
      ],
      "description": "Sacred wedding feasts served in leaf plates by traditional Boti chefs, highlighting yogurt-simmered chickpeas and steamed wheat yeast buns."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Kullu Dussehra Gathering of 300 Deities",
        "Minjar Fair of Chamba",
        "Kath-Kuni Seismic Architecture",
        "Devta Oracle Consultations"
      ],
      "description": "Devbhoomi (Abode of the Gods) where every village answers to a living local deity carried on palanquins."
    },
    "songsAndDances": {
      "performingArts": [
        "Nati Folk Dance (Guinness Record)",
        "Dangi Dance",
        "Chham Monastic Mask Dance",
        "Jhamakada Kangra Dance"
      ],
      "description": "Slow hypnotic circular dancing performed by thousands in matching traditional woolen caps and coats."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Kullu & Kinnauri Shawls",
        "Chamba Rumal",
        "Kangra Miniature Painting",
        "Chamba Chappals",
        "Himachali Topi Caps",
        "Thangka Painting"
      ],
      "description": "Pahari miniature paintings featuring lyrical lines, alongside exquisite two-sided silk embroidery."
    },
    "traditionalClothes": {
      "attire": [
        "Pattoo Woolen Dress",
        "Himachali Topi (Bushehri/Kulluvi)",
        "Pashmina Stole",
        "Dhatu Headscarf"
      ],
      "description": "Warm, dense woolen wraps pinned with silver brooches (boomani) and distinct velvet-rimmed regional caps."
    },
    "spiritualPlaces": {
      "sites": [
        "Hidimba Devi Temple (Manali)",
        "Jwalamukhi Eternal Flame Temple",
        "Baijnath Shiva Temple",
        "Tabo Monastery (1,000 Years Old)",
        "Chintpurni Shaktipeeth"
      ],
      "description": "Sacred natural flames issuing continuously from rock fissures, and millennial Buddhist monastic mud complexes."
    },
    "historicMonuments": {
      "monuments": [
        "Kangra Fort (Oldest Fort in Himalayas)",
        "Kalka-Shimla Toy Railway (UNESCO)",
        "Viceregal Lodge (Shimla)",
        "Naggar Castle (Kath-Kuni Wood)"
      ],
      "description": "Earthquake-resilient stone and deodar timber Kath-Kuni castles perched precipitously over Himalayan gorges."
    }
  },
  "uttarakhand": {
    "id": "uttarakhand",
    "stateName": "Uttarakhand",
    "coordinates": [
      30.0668,
      79.0193
    ],
    "heroImage": "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Almora",
        "productName": "Almora Bal Mithai",
        "category": "Food Processing",
        "giTagged": false,
        "description": "Fudge-like roasted brown khoya coated with white sugar pearls and wrapped in oak leaves."
      },
      {
        "district": "Chamoli",
        "productName": "Ringal Bamboo Craft",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Hand-woven high-altitude dwarf bamboo baskets, mats, and planters."
      },
      {
        "district": "Nainital",
        "productName": "Aipan Geometric Floor & Wall Art",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Geometric white rice paste motifs painted on natural red clay ochre background."
      },
      {
        "district": "Pithoragarh",
        "productName": "Munsiyari White Rajma",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Glacier-fed mountain kidney beans prized for soft melting texture and aroma."
      }
    ],
    "food": {
      "signatureDishes": [
        "Kafuli (Spinach & Fenugreek Puree)",
        "Chainsoo (Roasted Black Gram Gravy)",
        "Bhatt ki Churkani",
        "Bal Mithai",
        "Jhangore ki Kheer",
        "Aloo ke Gutke"
      ],
      "description": "Wholesome mountain fuel rich in iron and proteins, starring wild herbs (jambhura), hill lentils, and Himalayan millets."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Kumbh Mela at Haridwar (UNESCO)",
        "Nanda Devi Raj Jat 280km Pilgrimage",
        "Ganga Aarti at Rishikesh Triveni Ghat",
        "Chipko Forest Protection Movement"
      ],
      "description": "The celestial descent of the Ganges into the plains, commemorated by millions of pilgrims and Vedic hermits."
    },
    "songsAndDances": {
      "performingArts": [
        "Chholiya Martial Sword Dance",
        "Jhora & Chanchari Circular Folk Songs",
        "Pandav Nritya Reenactment",
        "Bedu Pako Ballad"
      ],
      "description": "Martial dances featuring glittering brass shields and curved swords performed during high-altitude wedding processions."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Aipan Art",
        "Ringal Bamboo Weaving",
        "Tamta Brass Utensils of Almora",
        "Pashmina & Thulma Blankets",
        "Wood Carving"
      ],
      "description": "Sacred ritualistic threshold geometry painted by Kumaoni women, alongside hand-carved deodar door frames."
    },
    "traditionalClothes": {
      "attire": [
        "Pichora Bridal Shawl with Golden Swastik",
        "Ghagro-Pichora Ensemble",
        "Kurta with Pahadi Topi"
      ],
      "description": "Yellow and saffron silk dupattas hand-printed with auspicious symbols and massive gold nose rings (Nathuli)."
    },
    "spiritualPlaces": {
      "sites": [
        "Kedarnath Temple (Jyotirlinga)",
        "Badrinath Dham (Char Dham)",
        "Gangotri & Yamunotri Shrines",
        "Har ki Pauri (Haridwar)",
        "Hemkund Sahib (High Altitude Gurdwara)"
      ],
      "description": "The sacred Char Dham Himalayan circuit set amidst towering glaciers and rushing glacial torrents."
    },
    "historicMonuments": {
      "monuments": [
        "Jageshwar Temple Complex (124 Stone Temples)",
        "Katarmal Sun Temple (9th Century)",
        "Chandpur Garhi Ruins",
        "Pithoragarh Fort"
      ],
      "description": "Clusters of intricately sculpted Nagara stone temples nestled inside towering deodar pine forests."
    }
  },
  "bihar": {
    "id": "bihar",
    "stateName": "Bihar",
    "coordinates": [
      25.0961,
      85.3131
    ],
    "heroImage": "https://images.unsplash.com/photo-1599818498877-c98f828a1c97?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Madhubani",
        "productName": "Madhubani (Mithila) Paintings",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Line art painted with twigs, nibs, and fingers using natural pigments and dyes."
      },
      {
        "district": "Bhagalpur",
        "productName": "Bhagalpuri Tussar Silk",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Wild forest silkworm cocoons spun into textured golden natural silk fabrics."
      },
      {
        "district": "Muzaffarpur",
        "productName": "Shahi Litchi",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Translucent juicy sweet litchi with a tiny seed and distinct rose aroma."
      },
      {
        "district": "Nalanda",
        "productName": "Bawan Buti Handloom Weave",
        "category": "Handlooms",
        "giTagged": false,
        "description": "52 Buddhist and Tantric motifs woven into fine cotton sarees on frame looms."
      }
    ],
    "food": {
      "signatureDishes": [
        "Litti Chokha with Sattu & Ghee",
        "Sattu Paratha",
        "Khaja Sweet of Silao (GI Tagged)",
        "Champaran Ahuna Mutton in Clay Pot",
        "Thekua (Chhath Prasad)",
        "Tilkut of Gaya"
      ],
      "description": "Nutritious roasted gram flour (sattu) delicacies, wood-fired dough balls dipped in molten ghee, and clay-pot slow-cooked meats."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Chhath Puja Sun Worship",
        "Sama Chakeva Brother-Sister Festival",
        "Mithila Vivaha Heritage",
        "Sonepur Cattle Fair"
      ],
      "description": "The strictest solar fast in India performed standing in river waters at dawn and dusk offering gratitude to nature."
    },
    "songsAndDances": {
      "performingArts": [
        "Bidesia Folk Theatre by Bhikhari Thakur",
        "Jat-Jatin Dance",
        "Kajari and Sohar Folk Songs",
        "Jharni Dance"
      ],
      "description": "Heartrending migration folk plays depicting the emotional toll of indentured labor, accompanied by the harmonium."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Madhubani Painting",
        "Sujani Needle Embroidery",
        "Sikki Grass Golden Fiber Craft",
        "Bhagalpur Tussar Silk",
        "Manjusha Angika Art"
      ],
      "description": "Ecologically sacred crafts using dried wild golden sikki grass, and needlepoint embroidery illustrating village life."
    },
    "traditionalClothes": {
      "attire": [
        "Mithila Hand-Painted Silk Saree",
        "Bhagalpuri Tussar Silk Kurta",
        "Dhoti with Angavastram",
        "Champa Saree"
      ],
      "description": "Pure tussar silk hand-painted with mythological Radha-Krishna and fish-lotus motifs."
    },
    "spiritualPlaces": {
      "sites": [
        "Mahabodhi Temple Complex (Bodh Gaya, UNESCO)",
        "Vishnupad Temple (Gaya)",
        "Takht Sri Patna Sahib",
        "Jal Mandir (Pawapuri Jain Shrine)",
        "Mahavir Mandir (Patna)"
      ],
      "description": "The Diamond Throne and Sacred Bodhi Tree under which Siddhartha Gautama attained supreme enlightenment."
    },
    "historicMonuments": {
      "monuments": [
        "Nalanda Mahavihara Ancient University (UNESCO)",
        "Ruins of Vikramashila University",
        "Barabar Rock-Cut Caves (Ashokan)",
        "Rohtasgarh Hill Fort",
        "Sher Shah Suri Tomb (Sasaram)"
      ],
      "description": "The world first residential international university which housed 10,000 scholars, and India oldest rock-cut caves."
    }
  },
  "jharkhand": {
    "id": "jharkhand",
    "stateName": "Jharkhand",
    "coordinates": [
      23.6102,
      85.2799
    ],
    "heroImage": "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Hazaribagh",
        "productName": "Sohrai & Khovar Tribal Murals",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Clay wall painting using naturally occurring red, yellow, and black manganese earths."
      },
      {
        "district": "Seraikela Kharsawan",
        "productName": "Seraikela Chhau Masks",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Dark-eyed stylized masks crafted from dark clay and paper for royal martial dance."
      },
      {
        "district": "Ranchi",
        "productName": "Tribal Lac Handicrafts & Bangles",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Natural insect resin heated, shaped, and studded with glass beads."
      },
      {
        "district": "Dumka",
        "productName": "Tussar Silk Cocoon Reeling",
        "category": "Handlooms",
        "giTagged": false,
        "description": "Forest-sourced cocoons reeled and hand-woven by Santhal tribal artisans."
      }
    ],
    "food": {
      "signatureDishes": [
        "Dhuska with Ghugni",
        "Rugda & Phutka (Forest Mushrooms)",
        "Litti with Chokha",
        "Bamboo Shoot Curry (Karil)",
        "Arsa Roti",
        "Handia Rice Beverage"
      ],
      "description": "Earthy forest gastronomy rich in wild mushrooms, crunchy bamboo shoots, fermented rice fritters, and steamed leaf parcels."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Sarhul Spring Sal Tree Worship",
        "Karam Festival for Nature & Harvest",
        "Birsa Munda Ulgulan Rebel Lore",
        "Jani Shikar Women Hunting"
      ],
      "description": "Deep reverence for the sacred Sal forest groves (Jaherthan) and celebrated historical defiance against colonial encroachment."
    },
    "songsAndDances": {
      "performingArts": [
        "Seraikela Chhau Masked Dance (UNESCO)",
        "Jhumair Tribal Dance",
        "Domkach Festive Dance",
        "Paika Martial Sword Dance",
        "Fagua"
      ],
      "description": "Lyrical stylized martial ballets reenacting nature, animals, and epics with elegant mask movements."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Sohrai and Khovar Wall Art",
        "Paitkar Scroll Paintings of Amadubi",
        "Dhokra Bell Metal Lost-Wax Casting",
        "Bamboo & Wood Craft"
      ],
      "description": "One of the oldest surviving scroll-painting traditions in India practiced by the indigenous Chitrakar community."
    },
    "traditionalClothes": {
      "attire": [
        "Panchi & Parhan Santhali Handloom Dress",
        "Tussar Silk Kurta",
        "Gamchha"
      ],
      "description": "Two-piece check-patterned handspun cotton sarees with bright red borders worn during forest dances."
    },
    "spiritualPlaces": {
      "sites": [
        "Baidyanath Jyotirlinga Temple (Deoghar)",
        "Parasnath Hill (Shikharji Jain Pilgrimage)",
        "Rajrappa Chhinnamasta Temple",
        "Jagannath Temple (Ranchi)",
        "Maluti Terracotta Temples"
      ],
      "description": "The highest summit in Jharkhand where 20 of the 24 Jain Tirthankaras attained Nirvana."
    },
    "historicMonuments": {
      "monuments": [
        "Maluti Terracotta Temple Village (72 Surviving Shrines)",
        "Palamu Forts (Chera Dynasty)",
        "Navratangarh Fort (Gumla)",
        "Telkupi Submerged Temples"
      ],
      "description": "A remote village studded with 17th-century terracotta temples adorned with Ramayana bas-reliefs."
    }
  },
  "madhya-pradesh": {
    "id": "madhya-pradesh",
    "stateName": "Madhya Pradesh",
    "coordinates": [
      22.9734,
      78.6569
    ],
    "heroImage": "https://images.unsplash.com/photo-1600100397608-f010f4448553?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Ashoknagar",
        "productName": "Chanderi Silk & Cotton Sarees",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Gossamer sheer texture woven with silk warp and cotton weft with zari bootis."
      },
      {
        "district": "Khargone",
        "productName": "Maheshwari Sarees & Fabrics",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Reversible border (Bugdi) sarees pioneered by Rajmata Ahilyabai Holkar."
      },
      {
        "district": "Dhar",
        "productName": "Bagh Block Print Textiles",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Vegetable dyes using red alizarin and iron dross printed on banks of Bagh river."
      },
      {
        "district": "Dindori",
        "productName": "Gond Tribal Paintings",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Intricate signature dots and lines capturing forest myths and animal spirits."
      },
      {
        "district": "Datia",
        "productName": "Bell Metal Casting (Tikamgarh & Datia)",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Lost-wax bronze horse figurines, candle stands, and bells."
      },
      {
        "district": "Ratlam",
        "productName": "Ratlami Sev",
        "category": "Food Processing",
        "giTagged": true,
        "description": "Spicy chickpea flour sev seasoned with clove and hing."
      }
    ],
    "food": {
      "signatureDishes": [
        "Poha Jalebi of Indore",
        "Bhutte ka Kees (Grated Corn in Milk)",
        "Dal Bafla with Kadhi",
        "Ratlami Sev",
        "Bhopali Gosht Korma",
        "Mawa Bati"
      ],
      "description": "The culinary crossroads of India, celebrated for Indore iconic midnight street food bazaars at Sarafa."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Khajuraho Dance Festival",
        "Tansen Sangeet Samaroh (Gwalior)",
        "Bhagoria Haat Tribal Festival",
        "Narmada Parikrama Pilgrimage"
      ],
      "description": "The circular 2,600-km walking pilgrimage around the holy Narmada river, honored for thousands of years."
    },
    "songsAndDances": {
      "performingArts": [
        "Gwalior Classical Gharana Khayal",
        "Matki Dance of Malwa",
        "Karma Dance of Gonds & Baigas",
        "Rai Dance of Bundelkhand",
        "Pandavani"
      ],
      "description": "The cradle of Hindustani classical vocal music founded by Mian Tansen, alongside vibrant tribal harvest dances."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Chanderi & Maheshwari Weaving",
        "Gond Tribal Art",
        "Bagh Print",
        "Batto Bai Dolls of Gwalior",
        "Zari Zardozi of Bhopal"
      ],
      "description": "Luminescent gossamer silks favored by royal dynasties and vibrant dot-and-line tribal paintings."
    },
    "traditionalClothes": {
      "attire": [
        "Chanderi Silk Saree",
        "Maheshwari Saree",
        "Dhoti with Angrakha and Safa",
        "Bandhani Lugda"
      ],
      "description": "Translucent pastel silks edged with reversible miniature fort and chevron architectural borders."
    },
    "spiritualPlaces": {
      "sites": [
        "Mahakaleshwar Jyotirlinga (Ujjain)",
        "Omkareshwar Jyotirlinga (Narmada Island)",
        "Sanchi Great Buddhist Stupa (UNESCO)",
        "Amarkantak (Source of Narmada)",
        "Chitrakoot Ramayana Trail"
      ],
      "description": "The cosmic center of ancient Hindu timekeeping at Ujjain, and the island shaped naturally like the sacred Om symbol."
    },
    "historicMonuments": {
      "monuments": [
        "Khajuraho Group of Monuments (UNESCO)",
        "Gwalior Fort (Pearl of Indian Fortresses)",
        "Sanchi Stupa (UNESCO)",
        "Bhimbetka Prehistoric Rock Shelters (UNESCO)",
        "Mandu Jahaz Mahal (Ship Palace)"
      ],
      "description": "30,000-year-old Stone Age cave paintings, soaring Chandela temple spires, and floating Afghan palaces."
    }
  },
  "chhattisgarh": {
    "id": "chhattisgarh",
    "stateName": "Chhattisgarh",
    "coordinates": [
      21.2787,
      81.8661
    ],
    "heroImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Bastar",
        "productName": "Bastar Dhokra Bell Metal",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Lost-wax casting using beeswax wires to create intricate tribal figurines."
      },
      {
        "district": "Bastar",
        "productName": "Bastar Wrought Iron Craft (Loha Shilp)",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Recycled iron beaten on charcoal hearths into lamps, birds, and musicians."
      },
      {
        "district": "Janjgir-Champa",
        "productName": "Kosa Tussar Silk Fabrics",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Wild Antheraea mylitta silkworm cocoons woven into shimmering gold fabric."
      },
      {
        "district": "Dhamtari",
        "productName": "Nagari Dubraj Rice",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Traditional aromatic short-grain rice known as Basmati of Central India."
      },
      {
        "district": "Kondagaon",
        "productName": "Bastar Wooden Carvings & Masks",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Teak and Sheesham wood carved into tribal totems and harvest deities."
      }
    ],
    "food": {
      "signatureDishes": [
        "Chila with Tomato Chutney",
        "Faraa (Steamed Rice Flour Dumplings)",
        "Bafauri (Chana Dal Steamed Balls)",
        "Dubki Kadhi",
        "Aamat (Tribal Mixed Veg Stew)",
        "Chaprah (Red Ant Chutney)"
      ],
      "description": "Nutritious rice-bowl cuisine relying on steam, wild forest leaves, roasted sesame seeds, and indigenous forest chutneys."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Bastar Dussehra (75-Day Longest Festival)",
        "Madai Tribal Festival",
        "Hareli Farming Festival",
        "Ghotul Community Youth Lodges"
      ],
      "description": "The world longest festival dedicated entirely to Goddess Danteshwari, without burning any effigies of Ravana."
    },
    "songsAndDances": {
      "performingArts": [
        "Panthi Dance of Satnamis",
        "Raut Nacha (Yaduvanshi Dance)",
        "Pandavani Ballad by Teejan Bai",
        "Karma & Saila Tribal Dances",
        "Gedi Stilt Dance"
      ],
      "description": "Hypnotic tambura-strumming ballad reenactments of the Mahabharata, alongside acrobatic stilt dances."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Bastar Dhokra",
        "Loha Shilp Wrought Iron",
        "Kosa Tussar Silk",
        "Terracotta of Kumharpara",
        "Godna Tattoo Art on Fabrics"
      ],
      "description": "Primordial metallurgical and blacksmith crafts inherited continuously from ancient tribal ancestors."
    },
    "traditionalClothes": {
      "attire": [
        "Lugda (Kosa Silk Saree)",
        "Polkha Blouse",
        "Dhoti with Pheta",
        "Beaded Tribal Ornaments"
      ],
      "description": "Natural tussar silk weaves worn with heavy silver coin neckpieces and peacock feather adornments."
    },
    "spiritualPlaces": {
      "sites": [
        "Danteshwari Temple (Dantewada)",
        "Bhoramdeo Temple (Khajuraho of Chhattisgarh)",
        "Bambleshwari Temple (Dongargarh)",
        "Sirpur Buddhist Heritage Sites",
        "Rajim Rajiv Lochan Temple"
      ],
      "description": "Ancient 52-Shaktipeeth shrines located deep in Dandakaranya forests, and monolithic 8th-century brick monasteries."
    },
    "historicMonuments": {
      "monuments": [
        "Bhoramdeo Temple Complex",
        "Sirpur Group of Monuments (Lakshmana Temple)",
        "Kanker Palace",
        "Ratanpur Fort Ruins",
        "Chitrakote Horseshoe Waterfall"
      ],
      "description": "Magnificent 11th-century Nagara temple architecture adorned with erotic stone carvings in scenic Maikal hills."
    }
  },
  "goa": {
    "id": "goa",
    "stateName": "Goa",
    "coordinates": [
      15.2993,
      74.124
    ],
    "heroImage": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "North Goa",
        "productName": "Goan Cashew Feni",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Traditional pot-distilled spirit fermented from hand-stomped ripe cashew apples."
      },
      {
        "district": "South Goa",
        "productName": "Kunbi Tribal Cotton Sarees",
        "category": "Handlooms",
        "giTagged": false,
        "description": "Coarse red-and-white checkered cotton weave with simple geometric borders."
      },
      {
        "district": "North Goa",
        "productName": "Azulejos Hand-Painted Glazed Ceramic Tiles",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Indo-Portuguese tin-glazed ceramic tile painting featuring floral and historical motifs."
      },
      {
        "district": "South Goa",
        "productName": "Khola Chilli (Canacona)",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Brilliant red medium-pungent chillies grown on the red laterite slopes of Canacona."
      }
    ],
    "food": {
      "signatureDishes": [
        "Goan Fish Curry with Rice",
        "Pork Vindaloo",
        "Bebinca (7-Layer Coconut Cake)",
        "Xacuti Chicken with Roasted Coconut",
        "Poi Leavened Bread",
        "Sol Kadhi with Kokum"
      ],
      "description": "Lively coastal Indo-Portuguese fusion bursting with tangy kokum, toddy vinegar, freshly grated coconut, and fiery peri-peri chillies."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Shigmo Spring Festival",
        "Goa Carnival Street Floats",
        "Feast of St. Francis Xavier",
        "Zagor Night Folk Theatre"
      ],
      "description": "The joyful convergence of Konkani harvest ceremonies and grand Portuguese Catholic carnival parades."
    },
    "songsAndDances": {
      "performingArts": [
        "Fugdi Women Circle Dance",
        "Dhalo Folk Dance",
        "Mando Love Ballad with Violin",
        "Dekhnni Classical-Folk Blend",
        "Ghop Dance"
      ],
      "description": "Romantic Portuguese-Konkani violin serenades alternating with fast-paced rhythmic clapping circle dances."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Azulejos Ceramic Tiles",
        "Kunbi Handloom Weaving",
        "Terracotta Pottery of Bicholim",
        "Seashell Handicrafts",
        "Brass Lamp Carving"
      ],
      "description": "Intricate blue-and-white painted ceramic wall murals, marine shell jewelry, and heavy temple brass oil lamps."
    },
    "traditionalClothes": {
      "attire": [
        "Kunbi Saree (Draped without blouse above knees)",
        "Kashti Loincloth with Pudvem",
        "Pano Bhaju Formal Velvet Dress"
      ],
      "description": "Checkered crimson cotton sarees knotted gracefully over the right shoulder for working in paddy fields."
    },
    "spiritualPlaces": {
      "sites": [
        "Basilica of Bom Jesus (UNESCO, St. Francis Xavier Relics)",
        "Se Cathedral (Largest Church in Asia)",
        "Shanta Durga Temple (Kavlem)",
        "Mangueshi Temple (Priol)",
        "Safamjidi Mosque (Ponda)"
      ],
      "description": "Baroque cathedrals housing sacred incorrupt relics, alongside distinctive 5-story Deepastambha lamp towers."
    },
    "historicMonuments": {
      "monuments": [
        "Aguada Coastal Fort & 1864 Lighthouse",
        "Chapora Fort (Vagator)",
        "Reis Magos Fort",
        "Cabo de Rama Cliff Fort",
        "Fontainhas Latin Quarter"
      ],
      "description": "Laterite stone sea ramparts guarding river estuaries, and vibrant pastel-painted colonial quarters."
    }
  },
  "sikkim": {
    "id": "sikkim",
    "stateName": "Sikkim",
    "coordinates": [
      27.533,
      88.5122
    ],
    "heroImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "South Sikkim",
        "productName": "Temi Orthodox Organic Tea",
        "category": "Agriculture",
        "giTagged": false,
        "description": "100% organic tea garden nestled beneath Kanchenjunga producing delicate floral golden liquor."
      },
      {
        "district": "East Sikkim",
        "productName": "Sikkim Large Cardamom (Bara Elaichi)",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Indigenous smoked black large cardamom dried in traditional bhattis over wood smoke."
      },
      {
        "district": "West Sikkim",
        "productName": "Choktse Foldable Carved Wooden Tables",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Hand-carved Tibetan foldable wooden tables painted in brilliant traditional mineral lacquer."
      },
      {
        "district": "North Sikkim",
        "productName": "Lepcha Handloom Weaves",
        "category": "Handlooms",
        "giTagged": false,
        "description": "Natural nettle and sheep wool woven with vertical geometric stripes on back-strap looms."
      }
    ],
    "food": {
      "signatureDishes": [
        "Steamed Momos with Spiced Dalle Khursani Chutney",
        "Thukpa Noodle Soup",
        "Kinema Fermented Soybean Curry",
        "Gundruk Fermented Leaf Soup",
        "Sel Roti Ring Bread",
        "Chhurpi Cheese with Fern"
      ],
      "description": "India first 100% organic state culinary tradition, famous for fermented Himalayan soybean curries and fiery cherry chillies (Dalle)."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Pang Lhabsol Homage to Mt. Kanchenjunga",
        "Losar Tibetan New Year",
        "Bhumchu Sacred Water Vessel Ceremony",
        "Saga Dawa Buddhist Festivities"
      ],
      "description": "Sacred reverence for Mount Kanchenjunga as the supreme protective guardian deity of Sikkim."
    },
    "songsAndDances": {
      "performingArts": [
        "Cham Monastic Mask Dance with Cymbals",
        "Singhi Chaam (Snow Lion Dance)",
        "Yak Chaam",
        "Tamang Selo Dance with Damphu Drum",
        "Maruni"
      ],
      "description": "High monastic ritual dances enacting the victory of wisdom over negative forces through fierce animal and deity masks."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Thangka Silk Scroll Painting",
        "Choktse Carved Tables",
        "Lepcha Back-Strap Weaving",
        "Bhutia Woolen Carpets",
        "Handmade Rice Paper (Tsasho)"
      ],
      "description": "Spiritual scroll paintings adhering to sacred geometry, and dense hand-knotted dragon-motif wool carpets."
    },
    "traditionalClothes": {
      "attire": [
        "Bakhu (Kho) Wrap Robe with Honju Silk Blouse",
        "Dumvum Lepcha Dress",
        "Thokro Ankle-length Tunic"
      ],
      "description": "Flowing silk robes belted at the waist with vibrant sashes and lined with contrasting pastel silk sleeves."
    },
    "spiritualPlaces": {
      "sites": [
        "Rumtek Monastery (Dharma Chakra Centre)",
        "Pemayangtse Monastery (1705)",
        "Enchey Monastery",
        "Tashiding Holy Monastery",
        "Dubdi Monastery"
      ],
      "description": "Perched cliff-edge monasteries housing ancient gold stupas, holy relics, and centuries-old wooden mandalas."
    },
    "historicMonuments": {
      "monuments": [
        "Rabdentse Palace Ruins (2nd Capital of Sikkim)",
        "Coronation Throne of Norbugang (Yuksom)",
        "Singshore Suspension Bridge",
        "Kirateshwar Mahadev Shrines"
      ],
      "description": "Stone walls and royal chortens rising against the panoramic backdrop of the Himalayan snow range."
    }
  },
  "arunachal-pradesh": {
    "id": "arunachal-pradesh",
    "stateName": "Arunachal Pradesh",
    "coordinates": [
      28.218,
      94.7278
    ],
    "heroImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Tawang",
        "productName": "Monpa Handmade Woolen Carpets & Wooden Cups",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "High-altitude Tibetan wool carpets and turned walnut wood drinking cups."
      },
      {
        "district": "Lower Subansiri",
        "productName": "Apatani Cane & Bamboo Architecture & Shawls",
        "category": "Handlooms",
        "giTagged": false,
        "description": "Geometric black and white stripe weaves crafted on loin looms."
      },
      {
        "district": "West Kameng",
        "productName": "Monpa Wood Mask Craft",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Single-piece pine wood carved masks painted with organic mineral pigments."
      },
      {
        "district": "Lower Dibang Valley",
        "productName": "Idu Mishmi Textile Weaves",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Intricate diamond geometric patterns woven from nettle fibers and fine cotton."
      }
    ],
    "food": {
      "signatureDishes": [
        "Pika Pila (Bamboo Shoot & Pork Fat Pickle)",
        "Lukter (Dry Meat with Flakes of King Chilli)",
        "Chura Sabzi with Yak Cheese",
        "Apong (Fermented Rice Beer)",
        "Dung Po Steamed Rice in Leaves"
      ],
      "description": "Earthy, organic tribal forest cuisine reliant on fermented bamboo shoots, smoked mountain game, and fragrant hill herbs."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Losar Festival of Tawang",
        "Dree Agricultural Festival of Apatanis",
        "Mopin Harvest Festival of Galos",
        "Solung Abor Celebration"
      ],
      "description": "The Land of Dawn-Lit Mountains with 26 major indigenous tribes each preserving autonomous animist and Buddhist customs."
    },
    "songsAndDances": {
      "performingArts": [
        "Aji Lhamu Folk Dance Drama",
        "Bardo Chham Mask Dance",
        "Chalo Folk Dance of Nocte Tribe",
        "Popir Dance of Galos",
        "Wancho Dance"
      ],
      "description": "Allegorical mask performances illustrating the balance between good and evil spirits amidst high mountain passes."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Idu Mishmi Handlooms",
        "Monpa Wood Masks & Paper (Mon Shugu)",
        "Apatani Cane Baskets",
        "Wancho Wood Carvings"
      ],
      "description": "Bark-fiber papermaking and intricate loin-loom weaving producing garments that indicate tribal identity."
    },
    "traditionalClothes": {
      "attire": [
        "Gale Wrap Skirt (Apatani/Galo)",
        "Monpa Chhuba Woolen Robe",
        "Idu Mishmi Diamond Pattern Coat",
        "Yak-hair Cap"
      ],
      "description": "Geometric hand-woven cotton wrap skirts paired with woven yak-hair hats with five forward tassels."
    },
    "spiritualPlaces": {
      "sites": [
        "Tawang Monastery (Largest in India, 1681)",
        "Urgyeling Monastery (Birthplace of 6th Dalai Lama)",
        "Parshuram Kund (Holy Dip on Makar Sankranti)",
        "Golden Pagoda of Namsai",
        "Malinithan Temple Ruins"
      ],
      "description": "Fortress-like monastery perched at 10,000 feet holding a 28-foot gilded Buddha statue and thousands of rare manuscripts."
    },
    "historicMonuments": {
      "monuments": [
        "Ita Fort (Fort of Bricks, Itanagar, 14th Century)",
        "Jaswant Garh War Memorial",
        "Bhilakmarhi Fort Ruins",
        "Gekar Sinyi (Ganga Lake Citadel)"
      ],
      "description": "Ancient irregular brick fortifications built using 8 million hand-fired kiln bricks in the heart of lush rainforests."
    }
  },
  "nagaland": {
    "id": "nagaland",
    "stateName": "Nagaland",
    "coordinates": [
      26.1584,
      94.5624
    ],
    "heroImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Kohima",
        "productName": "Naga Warrior Handloom Shawls (Tsungkotepsu)",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Loin-loom woven shawls symbolizing warrior valor with painted animal motifs."
      },
      {
        "district": "Peren",
        "productName": "Naga King Chilli (Bhut Jolokia)",
        "category": "Agriculture",
        "giTagged": true,
        "description": "One of the world hottest chillies with over 1,000,000 Scoville heat units."
      },
      {
        "district": "Mon",
        "productName": "Konyak Tribal Wood Carvings & Brass Beaded Jewelry",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Hardwood carved guardian figures and headhunter commemorative brass necklaces."
      },
      {
        "district": "Mokokchung",
        "productName": "Naga Tree Tomato & Wild Honey",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Tart pulpy tree tomatoes and wild cliff honey harvested from virgin forests."
      }
    ],
    "food": {
      "signatureDishes": [
        "Smoked Pork with Axone (Fermented Soya Bean)",
        "Boiled Greens with Raja Mircha",
        "Bamboo Shoot Fish Curry",
        "Galho Rice Porridge",
        "Zutho (Fermented Rice Drink)"
      ],
      "description": "Fermented umami-rich delicacies centered on wood-smoked meats, fermented soya bean cakes (axone), and blistering King Chilli pods."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Hornbill Festival (Festival of Festivals)",
        "Feast of Merit Social Elevation",
        "Konyak Headhunter Lore",
        "Morung Youth Dormitories"
      ],
      "description": "Sixteen distinct tribes converging at Kisama Heritage Village to showcase songs, archery, and indigenous games."
    },
    "songsAndDances": {
      "performingArts": [
        "Hornbill Warrior Dances with Spears",
        "Modse Folk Harmony Singing",
        "Zeliang Butterfly Dance",
        "Aoling Spring Festival Dance"
      ],
      "description": "Polyphonic choral harmonies sung without instruments, accompanied by synchronized stomping and spear thrusts."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Naga Shawls (Angami, Ao, Lotha)",
        "Cane & Bamboo Rain Hats",
        "Wood Carving of Morung Pillars",
        "Beaded Necklaces with Shells"
      ],
      "description": "Mastery of the simple waist loom producing distinct symbolic motifs that encode social achievements and lineage."
    },
    "traditionalClothes": {
      "attire": [
        "Tsungkotepsu Shawl",
        "Mechala Wrap Skirt",
        "Hornbill Feather Headgear",
        "Brass Beaded Torque"
      ],
      "description": "Vibrant black, red, and white textiles embroidered with cowrie shells and crowned by real black-and-white hornbill feathers."
    },
    "spiritualPlaces": {
      "sites": [
        "Kohima Cathedral (Catholic Church with Nagaland Architecture)",
        "Mount Tiyi (Sacred Mountain of Spirits)",
        "Living Rock of Dimapur",
        "Shilloi Lake (Lover Lake)"
      ],
      "description": "Architectural marvels integrating tribal bamboo thatched forms with Christian cathedral roofs amidst forested peaks."
    },
    "historicMonuments": {
      "monuments": [
        "Kohima War Cemetery (Battle of Kohima, WWII)",
        "Kachari Ruins (Chessboard Monolithic Pillars, Dimapur)",
        "Khonoma Green Village Fortifications"
      ],
      "description": "Mysterious 10th-century mushroom-shaped sandstone monoliths, and the heroic ridge where the WWII invasion was halted."
    }
  },
  "manipur": {
    "id": "manipur",
    "stateName": "Manipur",
    "coordinates": [
      24.6637,
      93.9063
    ],
    "heroImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Ukhrul",
        "productName": "Longpi Hamlei Black Stone Pottery",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Serpentine rock and weathered clay crafted without potter wheel and polished with machi leaf."
      },
      {
        "district": "Bishnupur",
        "productName": "Moirang Phee & Shaphee Lanphee Handloom",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Temple-skirt triangular step motifs representing the horn of the mythical Python god Pakhangba."
      },
      {
        "district": "Imphal West",
        "productName": "Chak-Hao (Black Aromatic Rice)",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Nutrient-dense black glutinous rice rich in anthocyanin turning deep purple when boiled."
      },
      {
        "district": "Thoubal",
        "productName": "Kauna Water Reed Mats & Furniture",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Natural spongy aquatic marsh grass woven into heat-resistant cushion mats and baskets."
      }
    ],
    "food": {
      "signatureDishes": [
        "Kangshoi (Vegetable Stew with Fermented Fish Ngari)",
        "Eromba (Mashed Boiled Vegetables with Chillies)",
        "Singju (Spicy Raw Vegetable Salad)",
        "Chak-Hao Kheer (Black Rice Pudding)",
        "Nga Thongba (Fish Curry)"
      ],
      "description": "Fragrant culinary balance utilizing fermented Ngari fish, fresh herbs, zero dry oil frying, and royal black rice puddings."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Lai Haraoba (Pleasing of the Sanamahi Deities)",
        "Sagol Kangjei (Origin of Modern Polo)",
        "Yaoshang (Spring Festival with Thabal Chongba)",
        "Floating Phumdis of Loktak Lake"
      ],
      "description": "The birthplace of modern polo played on agile Manipuri ponies, and sacred forest deities honored with primordial cosmogony dances."
    },
    "songsAndDances": {
      "performingArts": [
        "Manipuri Classical Raas Leela",
        "Thang-Ta Martial Art Dance with Swords",
        "Pung Cholom Acrobatic Drum Dance",
        "Luivat Pheizak Dance"
      ],
      "description": "Sublime ethereal circular devotional dances of Radha and Krishna, alongside high-leaping drum-spinning acrobatics."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Longpi Black Pottery",
        "Moirang Phee & Wangkhei Phee",
        "Kauna Craft",
        "Manipuri Dolls",
        "Cane & Woodcraft"
      ],
      "description": "Pottery made without a wheel using ancient stone-pounding methods, and gossamer-fine cotton shawls."
    },
    "traditionalClothes": {
      "attire": [
        "Phanek (Striped Lower Wrap)",
        "Innaphi (Delicate Gossamer Upper Shawl)",
        "Kummin (Stiff Cylindrical Dance Skirt)"
      ],
      "description": "Handwoven wraparound skirts with lotus and fish borders, paired with gossamer transparent pastel veils."
    },
    "spiritualPlaces": {
      "sites": [
        "Shree Govindaji Temple (Imphal)",
        "Kaina Sacred Hill (Sandalwood Krishna Image)",
        "Sanamahi Kiyong Temple",
        "Ibudhou Thangjing Temple (Moirang)"
      ],
      "description": "Golden twin-domed royal temples echoing with rhythmic sankirtana singing and classical hand cymbals."
    },
    "historicMonuments": {
      "monuments": [
        "Kangla Fort (Seat of Ancient Meitei Kings)",
        "INA Memorial & Headquarters (Moirang, Where Indian Flag was First Unfurled)",
        "Bishnupur 15th-Century Chinese-Style Brick Temple"
      ],
      "description": "The sacred spiritual and political citadel of Manipur on the banks of the Imphal River with massive brick bastions."
    }
  },
  "meghalaya": {
    "id": "meghalaya",
    "stateName": "Meghalaya",
    "coordinates": [
      25.467,
      91.3662
    ],
    "heroImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "West Jaintia Hills",
        "productName": "Lakadong Turmeric",
        "category": "Agriculture",
        "giTagged": true,
        "description": "World highest curcumin content (7% to 12%) golden turmeric cultivated organically in Jaintia hills."
      },
      {
        "district": "Ri-Bhoi",
        "productName": "Ryndia (Eri) Peace Silk",
        "category": "Handlooms",
        "giTagged": false,
        "description": "Thermal non-violent silk hand-spun from open cocoons without killing the moth, colored with plant dyes."
      },
      {
        "district": "East Khasi Hills",
        "productName": "Sohra Honey & Wild Forest Fruits",
        "category": "Agriculture",
        "giTagged": false,
        "description": "Rich amber multi-flora mountain honey gathered from limestone cliff crags."
      },
      {
        "district": "Garo Hills",
        "productName": "Garo Bamboo & Cane Furniture",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Sturdy bamboo craft incorporating intricate woven patterns into storage boxes and chairs."
      }
    ],
    "food": {
      "signatureDishes": [
        "Jadoh (Rice Cooked in Meat Broth)",
        "Dohneiiong (Pork with Roasted Black Sesame)",
        "Tungrymbai (Fermented Soybean Mash)",
        "Pukhlein (Fried Rice Powder & Jaggery Snack)",
        "Nakham Bitchi (Dry Fish Soup)"
      ],
      "description": "Comforting cloud-country cuisine celebrating nutty roasted black sesame pastes, fermented soybeans, and red hill rice."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Jingkieng Jri (Living Root Bridges)",
        "Matrilineal Social Heritage of Khasis",
        "Wangala 100-Drum Festival of Garos",
        "Sacred Mawphlang Forest Groves"
      ],
      "description": "Ingenious bio-engineering training Ficus elastica tree roots across centuries to form living suspension bridges over raging monsoon gorges."
    },
    "songsAndDances": {
      "performingArts": [
        "Shad Suk Mynsiem (Dance of Happy Hearts)",
        "Wangala 100-Drum Harvest Dance",
        "Ka Shad Mastieh (Warrior Dance)",
        "Doregata Dance"
      ],
      "description": "Girls dancing with slow grace carrying silver crowns and golden ornaments to the beat of nakra drums and wooden flutes."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Ryndia Silk Weaving",
        "Cane Knitted Rainshields (Knup)",
        "Bamboo Fishing Traps",
        "Black Clay Pottery of Larnai"
      ],
      "description": "Waterproof cone-shaped woven cane headgear worn during torrential monsoon rains in Cherrapunji."
    },
    "traditionalClothes": {
      "attire": [
        "Jainsem (Two-Piece Silk Wrap)",
        "Dhara Silk Formal Saree",
        "Garo Dakmanda Wrap Skirt"
      ],
      "description": "Two pieces of contrasting mulberry or eri silk fastened gracefully at both shoulders with gold pins."
    },
    "spiritualPlaces": {
      "sites": [
        "Mawphlang Sacred Forest (Untouched Sanctuary)",
        "Nartiang Monoliths (Largest Cluster in World)",
        "Jakrem Hot Springs",
        "Lum Nehru Park Shrines"
      ],
      "description": "Centuries-old ancient stone megaliths erected in honor of Khasi and Jaintia kings and warrior ancestors."
    },
    "historicMonuments": {
      "monuments": [
        "Double Decker Living Root Bridge (Nongriat)",
        "Nartiang Durga Temple (500 Years Old)",
        "Khyrim Syiem Palace at Smit (Built without Single Nail)"
      ],
      "description": "Living botanical bridges crossing 100-foot spans, and thatched timber royal palaces constructed entirely without metal nails."
    }
  },
  "mizoram": {
    "id": "mizoram",
    "stateName": "Mizoram",
    "coordinates": [
      23.1645,
      92.9376
    ],
    "heroImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Aizawl",
        "productName": "Mizo Puan Traditional Handloom Shawls",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Bold black and white geometric warp patterns (Puanchei and Ngotekherh) woven on loin looms."
      },
      {
        "district": "Kolasib",
        "productName": "Mizo Bird Eye Chilli",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Tiny pointed pungent wild chillies possessing intense citrus heat and aroma."
      },
      {
        "district": "Lunglei",
        "productName": "Mizo Ginger & Turmeric",
        "category": "Agriculture",
        "giTagged": true,
        "description": "High-oleoresin organic ginger grown on slash-and-burn jhum forest slopes."
      },
      {
        "district": "Champhai",
        "productName": "Champhai Grape Wine (Zawlaidi)",
        "category": "Food Processing",
        "giTagged": false,
        "description": "Full-bodied artisanal grape wine produced in the valley vineyards near Myanmar border."
      }
    ],
    "food": {
      "signatureDishes": [
        "Bai (Boiled Vegetables with Pork & Soda)",
        "Vawksa Rep (Smoked Pork with Mustard Greens)",
        "Sawhchiar (Meat & Rice Porridge)",
        "Sanpiau (Rice Congee with Fish Flakes)",
        "Chhangban (Steamed Glutinous Rice Cake)"
      ],
      "description": "Pure unadulterated highland nutrition cooked without cooking oil, relying on pork fat, soda, bamboo shoot, and wild mountain herbs."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Chapchar Kut Spring Bamboo Festival",
        "Tlawmngaina (Code of Selfless Moral Conduct)",
        "Thalfavang Kut Harvest",
        "Khuang Drum Night Vigils"
      ],
      "description": "The ethical compass of Tlawmngaina directing every Mizo citizen to place community welfare, hospitality, and courage above self."
    },
    "songsAndDances": {
      "performingArts": [
        "Cheraw (Bamboo Dance of Rhythm & Agility)",
        "Khuallam (Dance of the Guests)",
        "Chheihlam Festive Dance",
        "Solakia Martial Dance"
      ],
      "description": "World-famous synchronized bamboo dance where dancers step in and out between pairs of clapping horizontal bamboo poles."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Puan Handloom Weaving",
        "Cane & Bamboo Hat (Khumbeu)",
        "Handmade Smoking Pipes",
        "Traditional Hunting Baskets"
      ],
      "description": "Loin-loom weaving using back-strap tension frames, producing vibrant geometric skirts passed down generations."
    },
    "traditionalClothes": {
      "attire": [
        "Puanchei Festival Skirt",
        "Kawrchei Blouse",
        "Ngotekherh Shawl",
        "Vakiria Feather Headband"
      ],
      "description": "Striking crimson, green, and black woven horizontal panels worn with brass and porcupine quill headbands."
    },
    "spiritualPlaces": {
      "sites": [
        "Solomon Temple (Aizawl)",
        "Lianchhiari Lunglen Tlang (Cliff of Remembrance)",
        "Phawngpui Blue Mountain (Abode of the Gods)",
        "Rungdil Twin Lakes"
      ],
      "description": "The highest peak in Mizoram (Phawngpui) shrouded in clouds and believed to be inhabited by mountain spirits."
    },
    "historicMonuments": {
      "monuments": [
        "Reiek Heritage Village (Reconstructed Mizo Chieftain Houses)",
        "Sibuta Lung Memorial Stone",
        "Kawtchhuah Ropui Heritage Site (Carved Monoliths, Vangchhia)"
      ],
      "description": "Mysterious archaeological megaliths carved with human figures and animal reliefs deep in Vangchhia forest."
    }
  },
  "tripura": {
    "id": "tripura",
    "stateName": "Tripura",
    "coordinates": [
      23.9408,
      91.9882
    ],
    "heroImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "West Tripura",
        "productName": "Tripura Bamboo & Cane Handicrafts",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Filigree bamboo table mats, screens, lamps, and miniature umbrellas."
      },
      {
        "district": "Gomati",
        "productName": "Risa Handloom Textile",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Narrow ornamental chest wrap woven with colorful geometric diamond and floral motifs."
      },
      {
        "district": "North Tripura",
        "productName": "Queen Pineapple",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Crisp sweet, golden-fleshed non-fibrous pineapples celebrated for sweet aroma."
      },
      {
        "district": "Dhalai",
        "productName": "Tripura Natural Rubber Sheet Products",
        "category": "Agriculture",
        "giTagged": false,
        "description": "High tensile strength smoked ribbed sheets from hill agro-forestry estates."
      }
    ],
    "food": {
      "signatureDishes": [
        "Mui Borok with Berma (Fermented Fish)",
        "Chakhwi (Bamboo Shoot & Pork with Baking Soda)",
        "Wahan Mosdeng (Roasted Pork Salad with Coriander)",
        "Gudok (Mashed Vegetables in Bamboo Tube)",
        "Panch Phoron Tarkari"
      ],
      "description": "Distinctive zero-oil cuisine featuring fermented puthi fish (Berma), crisp bamboo shoots, and green chilies mashed in bamboo cylinders."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Kharchi Puja (Worship of Fourteen Gods)",
        "Garia Puja Bamboo Pole Invocation",
        "Ker Strict Ritual Lockdown",
        "Tripuri Manikya Royal Lore"
      ],
      "description": "A week-long royal festival cleansing Mother Earth with the holy bath of the 14 metal deity heads."
    },
    "songsAndDances": {
      "performingArts": [
        "Hojagiri Acrobatic Balance Dance on Pitchers",
        "Garia Folk Dance",
        "Bizhu Dance of Chakmas",
        "Lebang Boomani Harvest Dance"
      ],
      "description": "Young Reang women balancing lighted lamps on their heads while gyrating on the rim of earthen pitchers."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Bamboo Matting & Furniture",
        "Risa & Rignai Weaving",
        "Cane Flutes",
        "Coconut Shell Carvings"
      ],
      "description": "Fine-slit bamboo splints woven as delicately as silk threads, creating world-renowned interior screens."
    },
    "traditionalClothes": {
      "attire": [
        "Rignai (Lower Wrap Skirt)",
        "Risa (Upper Chest Wrap)",
        "Dhoti with Gamchha"
      ],
      "description": "Magnificent handwoven patterns where each Tripuri clan is identified by their distinct Rignai design."
    },
    "spiritualPlaces": {
      "sites": [
        "Tripura Sundari Temple (Udaipur, 51 Shaktipeeth)",
        "Unakoti Rock-Cut Shiva Reliefs",
        "Bhubaneswari Temple on Gomati",
        "Kamalasagar Kali Temple",
        "Benuban Vihar Buddhist Monastery"
      ],
      "description": "One of the 51 sacred Shaktipeeths where the right foot of Goddess Sati fell, constructed in Bengali Char-Chala style."
    },
    "historicMonuments": {
      "monuments": [
        "Unakoti Rock Carvings (One Less than a Crore Giant Faces)",
        "Ujjayanta Palace (Agartala)",
        "Neermahal Water Palace (Rudrasagar Lake)",
        "Pilak 8th-Century Buddhist Archaeological Site"
      ],
      "description": "A fairytale water palace rising out of the center of Rudrasagar Lake, and colossus rock reliefs sculpted on mountain faces."
    }
  },
  "ladakh": {
    "id": "ladakh",
    "stateName": "Ladakh",
    "coordinates": [
      34.1526,
      77.5771
    ],
    "heroImage": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Leh",
        "productName": "Ladakh Changthangi Pashmina Wool",
        "category": "Handlooms",
        "giTagged": true,
        "description": "Down fiber combed from Changra goats grazed at 14,000 feet on the Tibetan plateau."
      },
      {
        "district": "Kargil",
        "productName": "Raktsey Karpo Apricot",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Unique white-seeded sweet apricot with exceptional honey sweetness and high oil content."
      },
      {
        "district": "Leh",
        "productName": "Ladakh Wood Carving (Choktse)",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Larch and willow wood carved with dragons and lotus emblems painted in rich gold."
      },
      {
        "district": "Leh",
        "productName": "Sea Buckthorn (Leh Berry)",
        "category": "Agriculture",
        "giTagged": true,
        "description": "Wild high-altitude thorny bush berries packed with Vitamin C and Omega fatty acids."
      }
    ],
    "food": {
      "signatureDishes": [
        "Skyu (Pasta Stew with Root Vegetables)",
        "Chhutagi (Bowtie Pasta Soup)",
        "Butter Tea (Gur Gur Chai)",
        "Thukpa",
        "Tigmo (Steamed Swirl Bread)",
        "Tsampa (Roasted Barley Flour)"
      ],
      "description": "High-altitude fuel designed to survive -30\u00b0C winters, featuring roasted barley flour, salty yak butter tea, and warming pasta stews."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Hemis Monastic Festival",
        "Changpa Nomadic Migration",
        "Losar New Year Celebrations",
        "Ladakh Polo on Mountain Ponies"
      ],
      "description": "Trans-Himalayan Buddhist civilization preserved inside cliffside gompas overlooking barren lunar valleys."
    },
    "songsAndDances": {
      "performingArts": [
        "Cham Sacred Mask Dance",
        "Jabro Nomadic Dance",
        "Shondol (Royal Dance of Ladakh)",
        "Spao Martial Dance"
      ],
      "description": "Slow majestic court dances performed in flowing silk brocades and heavy turquoise peraks."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Thangka Scroll Painting",
        "Pashmina & Yak Wool Weaving",
        "Ladakhi Silver Jewelry with Turquoise",
        "Copper Metalware (Chaskhang)"
      ],
      "description": "Sacred Buddhist iconography rendered in crushed mineral lapis lazuli, coral, and malachite pigments."
    },
    "traditionalClothes": {
      "attire": [
        "Goncha (Heavy Woolen Robe with Sashes)",
        "Perak (Cobalt Turquoise Headpiece)",
        "Tibetan Felt Boots"
      ],
      "description": "Spectacular leather headdresses studded with 200+ raw turquoise gemstones inherited as family heirlooms."
    },
    "spiritualPlaces": {
      "sites": [
        "Hemis Gompa (Drukpa Lineage Head)",
        "Thiksey Monastery (Mini Potala)",
        "Diskit Monastery (Nubra Valley 100ft Maitreya)",
        "Alchi 11th-Century Murals",
        "Likir & Spituk Monasteries"
      ],
      "description": "Twelve-story white and red monastic citadels clinging to bare cliffs housing colossal gilded statues of the Future Buddha."
    },
    "historicMonuments": {
      "monuments": [
        "Leh Royal Palace (9-Story 16th-Century Fortress)",
        "Stok Palace Museum",
        "Shey Palace & Holy Fish Pond",
        "Basgo Mud Brick Fort Ruins"
      ],
      "description": "Mud-brick and timber cliff palaces modeled on the Potala of Lhasa, commanding the Indus valley."
    }
  },
  "delhi": {
    "id": "delhi",
    "stateName": "Delhi",
    "coordinates": [
      28.6139,
      77.209
    ],
    "heroImage": "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Central Delhi",
        "productName": "Zari Zardozi Bullion Wire Embroidery",
        "category": "Handlooms",
        "giTagged": false,
        "description": "Royal court metallic embroidery with gold bullion wire and sequins on velvet."
      },
      {
        "district": "North Delhi",
        "productName": "Chandni Chowk Silver Filigree & Jewelry",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Handcrafted Kundan, Meenakari, and beaten silver articles from historic bazaar guilds."
      },
      {
        "district": "South Delhi",
        "productName": "Artisanal Leather Goods & Apparel",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Contemporary and traditional handcrafted leather accessories and jackets."
      }
    ],
    "food": {
      "signatureDishes": [
        "Old Delhi Nihari with Khameeri Roti",
        "Butter Chicken (Daryaganj Heritage)",
        "Chandni Chowk Paranthe",
        "Chole Bhature",
        "Dahi Bhalle of Natraj",
        "Kulfi Falooda"
      ],
      "description": "The imperial capital of gastronomy, uniting rich Mughal courtly feasts with Punjabi partition dhabas and Chandni Chowk street chaats."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Phool Walon ki Sair (Festival of Flower Sellers)",
        "Nizamuddin Dargah Thursday Qawwali",
        "Mirza Ghalib Urdu Mushairas",
        "Ramleela at Red Fort Grounds"
      ],
      "description": "A historic confluence of eight ancient cities celebrating communal harmony with floral fans offered at temple and dargah."
    },
    "songsAndDances": {
      "performingArts": [
        "Delhi Gharana Hindustani Classical Vocal",
        "Sufi Qawwali of Hazrat Nizamuddin Auliya",
        "Kathak Delhi Kendra Traditions"
      ],
      "description": "Soulful 700-year-old Sufi devotional music pioneered by Amir Khusrau echoing in stone courtyards."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Zari Zardozi",
        "Ivory-Replica Bone Inlay",
        "Paper Cutting (Sanjhi)",
        "Handmade Tazia Bamboowork"
      ],
      "description": "Centuries-old artisan gullies in Shahjahanabad preserving bullion needlecraft, bookbinding, and calligraphy."
    },
    "traditionalClothes": {
      "attire": [
        "Sharara Suit with Zardozi Work",
        "Achkan with Churidar",
        "Nehru Jacket",
        "Jama Maslin Kurta"
      ],
      "description": "Regal tailored achkans, flowing flared shararas, and silk dupattas bordered with glittering gotapatti."
    },
    "spiritualPlaces": {
      "sites": [
        "Hazrat Nizamuddin Dargah",
        "Jama Masjid (India Largest Mosque)",
        "Gurudwara Bangla Sahib",
        "Akshardham Temple Complex",
        "Lotus Temple (Baha'i House of Worship)"
      ],
      "description": "Sanctuaries of absolute serenity welcoming millions of all faiths for free langar, prayer, and meditation."
    },
    "historicMonuments": {
      "monuments": [
        "Qutub Minar Complex (UNESCO)",
        "Humayun's Tomb (UNESCO, Prototype of Taj Mahal)",
        "Red Fort Complex (UNESCO)",
        "India Gate Memorial",
        "Jantar Mantar Astronomical Observatory"
      ],
      "description": "The world tallest brick minaret, Persian four-quadrant garden tombs, and colossal sandstone imperial fortresses."
    }
  },
  "chandigarh": {
    "id": "chandigarh",
    "stateName": "Chandigarh",
    "coordinates": [
      30.7333,
      76.7794
    ],
    "heroImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Chandigarh",
        "productName": "Nek Chand Rock Garden Sculptures & Mosaic Art",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Mosaic figures assembled entirely from recycled urban ceramics, broken bangles, and industrial slag."
      },
      {
        "district": "Chandigarh",
        "productName": "Modernist Pierre Jeanneret Teak Furniture",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Mid-century geometric teakwood and hand-woven cane chairs designed for the Capital Complex."
      }
    ],
    "food": {
      "signatureDishes": [
        "Amritsari Kulcha with Chole",
        "Tandoori Paneer Tikka",
        "Butter Chicken with Garlic Naan",
        "Lassi in Earthen Clay",
        "Gajar ka Halwa"
      ],
      "description": "A polished celebration of rich Punjabi farm-to-table flavors, charcoal tandoori grills, and sweet creamy lassi."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Rose Festival at Zakir Hussain Garden",
        "Open Hand Monument Philosophy",
        "Le Corbusier Modernist Architectural Heritage"
      ],
      "description": "The City Beautiful planned around the Open Hand emblem symbolizing peace, reconciliation, and giving."
    },
    "songsAndDances": {
      "performingArts": [
        "Modern Fusion Bhangra",
        "Classical Giddha",
        "Contemporary Theatre of Tagore Theatre"
      ],
      "description": "High-octane Punjabi folk rhythms blending with contemporary cosmopolitan theatre."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Recycled Mosaic Art",
        "Hand-Knitted Sweaters",
        "Cane Furniture Weaving"
      ],
      "description": "Visionary outsider art using industrial discarded porcelain, crockery, and electrical porcelain plugs."
    },
    "traditionalClothes": {
      "attire": [
        "Designer Punjabi Salwar Suit",
        "Modern Kurta with Linen Pants",
        "Phulkari Stole"
      ],
      "description": "Crisp urbanized Punjabi attire enlivened by vibrant hand-embroidered phulkari accents."
    },
    "spiritualPlaces": {
      "sites": [
        "Chandi Mandir (Goddess Chandi Sanctuary that gives City its Name)",
        "Gurudwara Sri Amb Sahib",
        "Mansa Devi Foothill Shrines"
      ],
      "description": "Ancient foothill shrines dedicated to the warrior Goddess Chandi, giving Chandigarh its eternal name."
    },
    "historicMonuments": {
      "monuments": [
        "Capitol Complex (UNESCO World Heritage Site)",
        "Nek Chand Rock Garden (40-Acre Wonderland)",
        "Sukhna Lake Promenade",
        "Open Hand Monument"
      ],
      "description": "Masterpieces of modern 20th-century brutalist architecture by Le Corbusier juxtaposed with enchanted recycled fantasy gardens."
    }
  },
  "puducherry": {
    "id": "puducherry",
    "stateName": "Puducherry",
    "coordinates": [
      11.9416,
      79.8083
    ],
    "heroImage": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Puducherry",
        "productName": "Auroville Handmade Paper & Incense",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "100% cotton-rag chemical-free handmade paper and pure botanical essential oil incense."
      },
      {
        "district": "Puducherry",
        "productName": "Terracotta & Ceramic Studio Pottery",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Contemporary stoneware and wood-fired ceramics crafted in international artisan communes."
      },
      {
        "district": "Karaikal",
        "productName": "Karaikal Fish Processing & Sea Food",
        "category": "Food Processing",
        "giTagged": false,
        "description": "Sun-dried mackerel, fresh crab, and export-grade tiger prawns."
      }
    ],
    "food": {
      "signatureDishes": [
        "Puducherry Creole Fish Curry",
        "Baguette with Camembert & Confiture",
        "Vadai with Coconut Chutney",
        "Assiette Anglaise",
        "Croissants & Cafe au Lait"
      ],
      "description": "Charming Franco-Tamil culinary synthesis blending crusty French baguettes and wine reductions with tangy tamarind seafood curries."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Sri Aurobindo Ashram Meditation",
        "Auroville Universal Township Fellowship",
        "Bastille Day Celebrations",
        "Masi Magam Sea Bathing Festival"
      ],
      "description": "A tranquil haven of integral yoga, international spiritual experimentation, and French colonial promenade living."
    },
    "songsAndDances": {
      "performingArts": [
        "Garadi Folk Dance with 10 Iron Rings",
        "Bharatanatyam at Temple Festivals",
        "French Chansons & Jazz"
      ],
      "description": "Ancient vanara martial dance where performers wear heavy iron rings that jingle to drum tempos."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Auroville Handmade Paper",
        "Terracotta Studio Pottery",
        "Leather Marbling Craft",
        "Aromatherapy Products"
      ],
      "description": "Sustainable hand-dipped marbling techniques on upcycled leather and unglazed terracotta pottery."
    },
    "traditionalClothes": {
      "attire": [
        "Tamil Koorainadu Saree",
        "French Linen Shirt with Trousers",
        "Veshti with Angavastram"
      ],
      "description": "Breathable pure white handwoven linen and cotton drapes suited to tropical coastal breezes."
    },
    "spiritualPlaces": {
      "sites": [
        "Sri Aurobindo Ashram",
        "Matrimandir Golden Meditation Globe (Auroville)",
        "Manakula Vinayagar Temple (Golden Chariot)",
        "Basilica of the Sacred Heart of Jesus"
      ],
      "description": "The futuristic golden geodesic sphere of Matrimandir containing the world largest optically-worked glass globe."
    },
    "historicMonuments": {
      "monuments": [
        "Goubert Avenue Promenade Waterfront",
        "French Quarter (White Town Colonial Mansions)",
        "Arikamedu Roman Trading Port Excavation"
      ],
      "description": "Ancient Roman empire maritime trading station where beads, amphorae, and wine vessels were unearthed."
    }
  },
  "dadra-and-nagar-haveli-and-daman-and-diu": {
    "id": "dadra-and-nagar-haveli-and-daman-and-diu",
    "stateName": "Dadra & Nagar Haveli and Daman & Diu",
    "coordinates": [
      20.3974,
      72.8328
    ],
    "heroImage": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Dadra & Nagar Haveli",
        "productName": "Warli Tribal Art & Bamboo Baskets",
        "category": "Handicrafts",
        "giTagged": true,
        "description": "Sacred geometric white rice paste murals painted on sun-baked dung walls."
      },
      {
        "district": "Diu",
        "productName": "Diu Dried Fish Processing & Salt",
        "category": "Food Processing",
        "giTagged": false,
        "description": "Marine salt pans and traditional sun-dried ribbon fish and Bombay duck."
      },
      {
        "district": "Daman",
        "productName": "Daman Artisanal Leather Footwear & Mats",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Sturdy braided reed mats and hand-stitched leather sandals."
      }
    ],
    "food": {
      "signatureDishes": [
        "Daman Fisherfolk Crab Curry",
        "Ubadiyu (Clay Pot Roasted Roots)",
        "Portuguese Cozido Stew",
        "Diu Prawns Balchao",
        "Dhokla & Thepla"
      ],
      "description": "Island and forest gastronomy balancing Portuguese wine-stewed meats with earthy clay-pot baked root vegetables."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Tarpa Dance Festival of Kokna Tribals",
        "Nariyal Poornima Sea Offering",
        "Feast of Our Lady of the Sea"
      ],
      "description": "Tribal wind instrument dances honoring the spirit of the forest alongside coastal Catholic maritime feasts."
    },
    "songsAndDances": {
      "performingArts": [
        "Tarpa Folk Dance (Circle around Musician)",
        "Mando & Vira Portuguese Folk Songs",
        "Gheria Tribal Dance"
      ],
      "description": "Hundreds of dancers interlocking hands in concentric spirals moving to the deep drone of the dried gourd tarpa horn."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Warli Painting",
        "Bamboo & Palm Leaf Weaving",
        "Sea Shell Craft",
        "Tortoise Shell Replica Art"
      ],
      "description": "Ancient visual iconography capturing Mother Earth (Palghat) surrounded by hunters, deer, and celestial suns."
    },
    "traditionalClothes": {
      "attire": [
        "Lugden (Short Tribal Saree)",
        "Dhoti with Turbans",
        "Portuguese Embroidered Frock"
      ],
      "description": "Bright knee-length cotton wraps accessorized with brass anklets and beaded neck collars."
    },
    "spiritualPlaces": {
      "sites": [
        "St. Paul's Church (Diu, 1601 Baroque)",
        "Gangeshwar Mahadev Sea Cave Lingas (Diu)",
        "Church of Our Lady of Remedies (Moti Daman)",
        "Bindrabin Temple (Silvassa)"
      ],
      "description": "Five sea-cavern Shiva lingas washed continuously by high-tide ocean waves, legendarily installed by the Pandavas."
    },
    "historicMonuments": {
      "monuments": [
        "Diu Fort (Sea Fortress with Cannons, 1535)",
        "Moti Daman Fort & Ramparts",
        "Nani Daman Fort",
        "Panikota Sea Jail Fortress"
      ],
      "description": "Formidable 16th-century ocean citadels encircled by sea moats, housing bronze cannons that defended maritime spice lanes."
    }
  },
  "andaman-and-nicobar-islands": {
    "id": "andaman-and-nicobar-islands",
    "stateName": "Andaman & Nicobar Islands",
    "coordinates": [
      11.7401,
      92.6586
    ],
    "heroImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "South Andaman",
        "productName": "Padauk Wood Carving & Marine Handicrafts",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Endemic redwood Padauk carved into decorative tables, walking sticks, and canoes."
      },
      {
        "district": "Nicobar",
        "productName": "Nicobari Coconut Shell Crafts & Oil",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Polished coconut shells carved into bowls, lamps, and pure virgin cold-pressed oil."
      },
      {
        "district": "North & Middle Andaman",
        "productName": "Andaman Spices (Clove, Nutmeg, Cinnamon)",
        "category": "Agriculture",
        "giTagged": false,
        "description": "Tropical rainforest estate spices yielding high essential oil fragrances."
      }
    ],
    "food": {
      "signatureDishes": [
        "Andaman Red Snapper Fish Curry",
        "Grilled Coral Lobster",
        "Coconut Prawn Masala",
        "Chilli Curry with Wild Pepper",
        "Steamed Banana Rice"
      ],
      "description": "A fresh oceanic banquet featuring freshly caught deep-sea lobsters, red snappers, and aromatic coconut spice broths."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Island Heritage Festival",
        "Nicobari Ossuary Feast",
        "Indigenous Tribal Lore (Great Andamanese, Sentinelese, Jarawas, Shompens)"
      ],
      "description": "Home to the world most ancient surviving Paleolithic hunter-gatherer populations living in sovereign harmony with deep primary rainforests."
    },
    "songsAndDances": {
      "performingArts": [
        "Nicobari Folk Circle Dance",
        "Onge Ancient Chants",
        "Island Sea Shanties"
      ],
      "description": "Slow hypnotic swaying circular dances performed under swaying coconut palms to the rhythm of ocean tides."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Padauk Woodwork",
        "Mother of Pearl & Shell Carving",
        "Cane & Bamboo Baskets",
        "Coconut Shell Art"
      ],
      "description": "Lustrous mother-of-pearl jewelry and deep-grained crimson Padauk hardwood maritime sculptures."
    },
    "traditionalClothes": {
      "attire": [
        "Island Tropical Linen & Cotton",
        "Traditional Bark Apron (Historical Indigenous)"
      ],
      "description": "Breezy tropical maritime clothing paired with seashell pendants and polished wooden hairpins."
    },
    "spiritualPlaces": {
      "sites": [
        "Sri Vetrimalai Murugan Temple (Port Blair)",
        "Radhanagar Sacred Beach Headland",
        "Ramakrishna Mission Centre (Port Blair)"
      ],
      "description": "Ocean-facing temple shrines echoing with devotional bells alongside pristine untouched natural mangrove sanctums."
    },
    "historicMonuments": {
      "monuments": [
        "Cellular Jail National Memorial (Kala Pani)",
        "Ross Island Ruins (Netaji Subhash Chandra Bose Island)",
        "Viper Island Gallows",
        "Barren Island Active Volcano"
      ],
      "description": "The historic seven-winged panopticon prison where India freedom fighters were incarcerated, now overgrown with ancient banyan roots."
    }
  },
  "lakshadweep": {
    "id": "lakshadweep",
    "stateName": "Lakshadweep",
    "coordinates": [
      10.5667,
      72.6417
    ],
    "heroImage": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    "odopProducts": [
      {
        "district": "Lakshadweep",
        "productName": "Lakshadweep Masmin (Smoked Dried Skipjack Tuna)",
        "category": "Food Processing",
        "giTagged": false,
        "description": "Hard-smoked and sun-dried skipjack tuna fillets possessing rich umami flavor."
      },
      {
        "district": "Lakshadweep",
        "productName": "Coir Yarn & Twisted Sea Ropes",
        "category": "Handicrafts",
        "giTagged": false,
        "description": "Saltwater-retted coconut fibers spun into rot-resistant nautical ropes."
      },
      {
        "district": "Lakshadweep",
        "productName": "Lakshadweep Virgin Coconut Oil & Jaggery (Meera)",
        "category": "Agriculture",
        "giTagged": false,
        "description": "Pure micro-filtered coconut oil and sweet jaggery boiled from sweet coconut palm sap."
      }
    ],
    "food": {
      "signatureDishes": [
        "Masmin Podichathu (Shredded Smoked Tuna with Coconut)",
        "Mus Kavaab (Spiced Tuna Skewers)",
        "Rayereha (Creamy Coconut Fish Curry)",
        "Kadalakka Sweet (Chana Dal Cake)",
        "Batla Appam"
      ],
      "description": "Intensely oceanic and tropical, starring smoked skipjack tuna, creamy freshly squeezed coconut milk, and sweet palm nectars."
    },
    "cultureAndFolklore": {
      "traditions": [
        "Saint Ubaidullah Island Conversion Lore",
        "Traditional Odam Sailing Expeditions",
        "Eid Island Feasts",
        "Lagoon Night Spear-Fishing"
      ],
      "description": "The 7th-century arrival of Arab saint Ubaidullah whose shipwrecked landing introduced Sufi Islam across the coral atolls."
    },
    "songsAndDances": {
      "performingArts": [
        "Kolkali Stick Dance",
        "Parichakali Shield & Sword Dance",
        "Attom Folk Dance",
        "Bait Devotional Chants"
      ],
      "description": "Lightning-fast rhythmic stick clacking and sword dueling dances performed by men in synchronized circular formations."
    },
    "craftsAndHandlooms": {
      "signatureCrafts": [
        "Coir Twisting & Net Making",
        "Tortoise Shell Replica Art",
        "Coral Limestone Model Carving",
        "Miniature Odam Boats"
      ],
      "description": "Traditional shipbuilding craftsmanship and hand-braided coconut coir nets capable of enduring rough sea conditions."
    },
    "traditionalClothes": {
      "attire": [
        "Kachi White Cotton Wrap with Silver Belt",
        "Thattam Head Veil",
        "Kurta with Mundu"
      ],
      "description": "Crisp cotton wraps secured with chased silver waist chains (Arayan) and delicate embroidered head veils."
    },
    "spiritualPlaces": {
      "sites": [
        "Ujra Mosque (Kavaratti, Intricate Teak Carvings)",
        "Tomb of Saint Ubaidullah (Andrott Island)",
        "Mohiddin Mosque",
        "Juma Mosque (Amini)"
      ],
      "description": "Carved deodar and teak wood mosques housing natural freshwater spring wells located within coral atolls."
    },
    "historicMonuments": {
      "monuments": [
        "Kalpeni 1885 Cast-Iron Lighthouse",
        "Kiltan Historical Beacon",
        "Suheli Par Coral Reef Outpost",
        "Andrott Archeological Buddhist Mound Ruins"
      ],
      "description": "Historic maritime navigation lighthouses standing sentinel over turquoise lagoons and vibrant coral barrier reefs."
    }
  }
};

export function getAllStateProfiles(): StateCulturalProfile[] {
  return Object.values(ODOP_CULTURAL_DATA);
}

export function getStateCulturalProfile(idOrName: string): StateCulturalProfile | undefined {
  if (!idOrName) return undefined;
  const clean = idOrName.toLowerCase().trim().replace(/\s+/g, '-').replace(/&/g, 'and');
  
  if (ODOP_CULTURAL_DATA[clean]) return ODOP_CULTURAL_DATA[clean];
  
  // Find by name match or alias
  return Object.values(ODOP_CULTURAL_DATA).find(p => 
    p.id.toLowerCase() === clean ||
    p.stateName.toLowerCase() === idOrName.toLowerCase().trim() ||
    p.stateName.toLowerCase().includes(idOrName.toLowerCase().trim()) ||
    clean.includes(p.id.toLowerCase())
  );
}

export function getODOPCatalog(category?: string, giOnly?: boolean): (ODOPDistrictItem & { stateName: string; stateId: string })[] {
  const catalog: (ODOPDistrictItem & { stateName: string; stateId: string })[] = [];
  for (const profile of Object.values(ODOP_CULTURAL_DATA)) {
    for (const item of profile.odopProducts) {
      if (category && category !== 'All' && item.category !== category) continue;
      if (giOnly && !item.giTagged) continue;
      catalog.push({
        ...item,
        stateName: profile.stateName,
        stateId: profile.id
      });
    }
  }
  return catalog;
}
