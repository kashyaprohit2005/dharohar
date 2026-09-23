export type Monument = {
  id: string;
  name: string;
  city: string;
  state: string;
  region: string;
  lat: number;
  lon: number;
  image: string;
  tag: string;
  history: string;
  highlights: string[];
};

export const NORTH_MONUMENTS: Monument[] = [
  { id:'taj-mahal', name:'Taj Mahal', city:'Agra', state:'Uttar Pradesh', region:'North India', lat:27.1751, lon:78.0421, image:'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=85', tag:'UNESCO • Mughal', history:'Commissioned by Shah Jahan as a mausoleum for Mumtaz Mahal, the ivory-white marble complex was completed in the 17th century and is one of India’s best-known monuments.', highlights:['Marble inlay craftsmanship','Charbagh garden','Yamuna riverfront'] },
  { id:'agra-fort', name:'Agra Fort', city:'Agra', state:'Uttar Pradesh', region:'North India', lat:27.1795, lon:78.0211, image:'https://images.unsplash.com/photo-1592639296346-560c37a0f711?auto=format&fit=crop&w=1200&q=85', tag:'UNESCO • Fort', history:'The red-sandstone citadel became a major Mughal seat of power and remained an imperial residence for generations.', highlights:['Jahangiri Mahal','Diwan-i-Am','Yamuna views'] },
  { id:'fatehpur-sikri', name:'Fatehpur Sikri', city:'Fatehpur Sikri', state:'Uttar Pradesh', region:'North India', lat:27.0945, lon:77.6679, image:'https://images.unsplash.com/photo-1629806451776-5e3f0d1f3e9d?auto=format&fit=crop&w=1200&q=85', tag:'UNESCO • City', history:'Akbar established this planned imperial city in the 16th century. Its courtyards, palaces and monumental gateways preserve a remarkable Mughal urban ensemble.', highlights:['Buland Darwaza','Panch Mahal','Jama Masjid'] },
  { id:'red-fort', name:'Red Fort', city:'Delhi', state:'Delhi', region:'North India', lat:28.6562, lon:77.2410, image:'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=85', tag:'UNESCO • Delhi', history:'Built by Shah Jahan after moving his court to Delhi, the Red Fort became the ceremonial and political heart of Shahjahanabad.', highlights:['Lahori Gate','Diwan-i-Khas','Mughal gardens'] },
  { id:'qutub-minar', name:'Qutub Minar', city:'Delhi', state:'Delhi', region:'North India', lat:28.5244, lon:77.1855, image:'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85', tag:'UNESCO • 12th century', history:'The towering red-and-buff sandstone minaret forms the centrepiece of the Qutb complex in southern Delhi, an important early Indo-Islamic architectural ensemble.', highlights:['72.5 m tower','Alai Darwaza','Quwwat-ul-Islam Mosque'] },
  { id:'humayun-tomb', name:"Humayun’s Tomb", city:'Delhi', state:'Delhi', region:'North India', lat:28.5933, lon:77.2507, image:'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85', tag:'UNESCO • Garden Tomb', history:'Built in the 16th century for Mughal emperor Humayun, this garden-tomb complex became an influential model for later Mughal architecture.', highlights:['Charbagh layout','Double dome','Persian-Mughal design'] },
  { id:'amber-fort', name:'Amber Fort', city:'Jaipur', state:'Rajasthan', region:'North India', lat:26.9855, lon:75.8513, image:'https://images.unsplash.com/photo-1599661046827-dacff0c8f7f4?auto=format&fit=crop&w=1200&q=85', tag:'UNESCO • Rajasthan', history:'Perched above Maota Lake, Amber Fort grew under Kachhwaha rulers and combines Rajput fortification with refined palace architecture.', highlights:['Sheesh Mahal','Maota Lake','Elephant courtyard'] },
  { id:'hawa-mahal', name:'Hawa Mahal', city:'Jaipur', state:'Rajasthan', region:'North India', lat:26.9239, lon:75.8267, image:'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85', tag:'Jaipur • Palace', history:'Completed in 1799, the Palace of Winds was designed with a honeycomb façade and many small openings that allow air to circulate through the structure.', highlights:['953 windows','Pink sandstone','City Palace quarter'] },
  { id:'jantar-mantar-jaipur', name:'Jantar Mantar', city:'Jaipur', state:'Rajasthan', region:'North India', lat:26.9248, lon:75.8246, image:'https://images.unsplash.com/photo-1590050752117-23a9d7fc4a2a?auto=format&fit=crop&w=1200&q=85', tag:'UNESCO • Astronomy', history:'Built in the 18th century by Sawai Jai Singh II, the monumental instruments were designed for observing celestial positions and measuring time.', highlights:['Samrat Yantra','Astronomical instruments','Jaipur City Palace area'] },
  { id:'golden-temple', name:'Golden Temple', city:'Amritsar', state:'Punjab', region:'North India', lat:31.6200, lon:74.8765, image:'https://images.unsplash.com/photo-1609947017136-9daf32a5eb16?auto=format&fit=crop&w=1200&q=85', tag:'Amritsar • Sacred', history:'Harmandir Sahib developed over centuries as a central Sikh shrine. Its sacred pool and gilded sanctum are at the heart of Amritsar’s old city.', highlights:['Amrit Sarovar','Gilded sanctum','Community langar'] },
  { id:'city-palace-udaipur', name:'City Palace', city:'Udaipur', state:'Rajasthan', region:'North India', lat:24.5764, lon:73.6835, image:'https://images.unsplash.com/photo-1700985959163-ed9aa14a99bd?auto=format&fit=crop&w=1200&q=85', tag:'Mewar • Palace', history:'Built and expanded by the rulers of Mewar across generations, the palace complex overlooks Lake Pichola and records centuries of Rajput court life.', highlights:['Lake Pichola','Mewar galleries','Courtyards'] },
  { id:'jallianwala-bagh', name:'Jallianwala Bagh', city:'Amritsar', state:'Punjab', region:'North India', lat:31.6206, lon:74.8801, image:'https://images.unsplash.com/photo-1730620775685-811aadc9ebdc?auto=format&fit=crop&w=1200&q=85', tag:'Amritsar • Memorial', history:'This walled garden was the site of the 1919 massacre of peaceful civilians by British colonial troops, a turning point in India’s independence movement. It is preserved today as a national memorial.', highlights:['Martyrs’ Well memorial','Bullet-mark walls','Freedom movement history'] }
];

export const TOURIST_SPOTS = [
  { name:'Varanasi Ghats', city:'Varanasi', state:'Uttar Pradesh', type:'River & Culture', image:'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=900&q=80', text:'Sunrise boat rides, riverside ghats and living traditions along the Ganga.' },
  { name:'Ranthambore National Park', city:'Sawai Madhopur', state:'Rajasthan', type:'Wildlife', image:'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=900&q=80', text:'Fort ruins, dry forests and a famous tiger landscape.' },
  { name:'Manali & Solang Valley', city:'Manali', state:'Himachal Pradesh', type:'Mountains', image:'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80', text:'Mountain views, alpine valleys and adventure experiences.' },
  { name:'Dal Lake', city:'Srinagar', state:'Jammu & Kashmir', type:'Lakes & Valleys', image:'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=900&q=80', text:'Houseboats, gardens and Himalayan scenery around the lake.' },
  { name:'Mussoorie', city:'Mussoorie', state:'Uttarakhand', type:'Hill Station', image:'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=900&q=80', text:'A classic Himalayan hill town with viewpoints, walks and colonial-era character.' },
  { name:'Jaisalmer Desert', city:'Jaisalmer', state:'Rajasthan', type:'Desert', image:'https://images.unsplash.com/photo-1490281127531-44704fa668fe?auto=format&fit=crop&w=900&q=80', text:'Golden dunes, desert camps, folk music and the living fort city.' }
];

export const RESTAURANTS = [
  { name:'Kesar Da Dhaba', city:'Amritsar', state:'Punjab', cuisine:'Punjabi • North Indian', image:'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80', note:'A classic old-city stop for Punjabi comfort food.' },
  { name:'Indian Accent', city:'New Delhi', state:'Delhi', cuisine:'Modern Indian', image:'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=900&q=80', note:'Contemporary Indian tasting experiences in a polished setting.' },
  { name:'1135 AD', city:'Jaipur', state:'Rajasthan', cuisine:'Rajasthani • Royal', image:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80', note:'A heritage dining experience inside Amber’s historic setting.' },
  { name:"Karim's", city:'Old Delhi', state:'Delhi', cuisine:'Mughlai • Kebabs', image:'https://images.unsplash.com/photo-1671507136750-05ebd0f97843?auto=format&fit=crop&w=900&q=80', note:'Serving Mughlai kebabs and curries near Jama Masjid since 1913 — a landmark of old Delhi\'s food history.' }
];
