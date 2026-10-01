// Data varian es krim ScoopMatch
export const FLAVORS = [
  {
    id: 'choco-therapy',
    name: 'Choco Therapy',
    tagline: 'Dark Belgian Chocolate & Cacao Fudge',
    description: 'Sensasi rasa cokelat Belgia 70% yang pekat dan legit dengan lelehan fudge swirl. Diformulasikan khusus untuk meredakan kepenatan dan menaikkan mood seketika!',
    color: {
      bg: 'from-amber-950 via-stone-800 to-amber-900',
      accent: '#684535',
      light: '#F5EBE6',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    moodMatch: '🤯 Lelah Lahir Batin & Butuh Pelukan Rasa',
    notes: ['70% Dark Cocoa', 'Gooey Fudge Swirl', 'Rich & Intensely Satisfying'],
    recommendedTopping: 'Extra Oreo & Choco Chips',
    basePrice: 15000,
    emoji: '🍫',
    tags: ['chocolate', 'rich', 'comfort', 'tired', 'exhausted'],
  },
  {
    id: 'berry-blast',
    name: 'Berry Blast Sorbet',
    tagline: 'Wild Strawberry & Raspberry Zing',
    description: 'Perpaduan asam-manis segar dari buah stroberi liar dan raspberi asli dengan semburat compote dingin. Sangat pas untuk mengembalikan semangat energikmu!',
    color: {
      bg: 'from-rose-500 via-pink-500 to-red-400',
      accent: '#E11D48',
      light: '#FFE4E6',
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    moodMatch: '🥳 Party Mode & Siap Menyala',
    notes: ['100% Real Berries', 'Segar Asam-Manis', 'Dairy-Free & Ultra Refreshing'],
    recommendedTopping: 'Potongan Buah Segar & Boba',
    basePrice: 15000,
    emoji: '🍓',
    tags: ['fruity', 'fresh', 'sour', 'party', 'energetic'],
  },
  {
    id: 'vanilla-dream',
    name: 'Vanilla Dream Clouds',
    tagline: 'Madagascar Bourbon Vanilla & Salted Cream',
    description: 'Krim vanilla Bourbon Madagaskar yang sangat lembut dan wangi aromatik, dipadukan dengan sentuhan krim mentega gurih halus. Bikin suasana hati jadi tenang dan damai.',
    color: {
      bg: 'from-amber-100 via-orange-100 to-yellow-50',
      accent: '#D97706',
      light: '#FEF3C7',
      badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    },
    moodMatch: '😎 Santai Aja & Chill Vibes',
    notes: ['Bourbon Vanilla Pods', 'Lumer Halus di Lidah', 'Classic Comfort'],
    recommendedTopping: 'Extra Oreo & Roasted Almond',
    basePrice: 15000,
    emoji: '🍦',
    tags: ['vanilla', 'creamy', 'smooth', 'chill', 'relaxed'],
  },
  {
    id: 'caramel-crunch',
    name: 'Caramel Biscoff Crunch',
    tagline: 'Salted Caramel Swirl & Lotus Biscoff Crumb',
    description: 'Es krim karamel gurih dengan remahan biskuit Lotus karamelisasi dan kacang panggang renyah. Kombinasi rasa manis legit gurih yang bikin lidah menari gembira!',
    color: {
      bg: 'from-amber-600 via-yellow-600 to-amber-700',
      accent: '#B45309',
      light: '#FDE68A',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    moodMatch: '😴 Butuh Bangkit & Booster Semangat',
    notes: ['Artisan Salted Caramel', 'Lotus Biscoff Crunch', 'Gurih Manis Nagih'],
    recommendedTopping: 'Choco Chips & Roasted Almond',
    basePrice: 15000,
    emoji: '🍪',
    tags: ['crunchy', 'caramel', 'sweet', 'tired', 'party'],
  },
  {
    id: 'matcha-zen',
    name: 'Matcha Zen Garden',
    tagline: 'Ceremonial Uji Matcha & White Chocolate',
    description: 'Teh hijau Jepang Uji asli beraroma wangi daun teh segar dengan tingkat kepahitan yang seimbang dan manis lembut dari kepingan cokelat putih. Menyejukkan pikiran seketika.',
    color: {
      bg: 'from-emerald-600 via-green-600 to-teal-700',
      accent: '#059669',
      light: '#D1FAE5',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    moodMatch: '🧘 Butuh Ketenangan Jiwa & Fokus',
    notes: ['Ceremonial Grade Matcha', 'Aroma Herbal Menenangkan', 'Earthy & Creamy'],
    recommendedTopping: 'Boba & Extra Oreo',
    basePrice: 15000,
    emoji: '🍵',
    tags: ['creamy', 'chill', 'zen', 'smooth', 'fresh'],
  }
];

export const TOPPINGS = [
  { id: 'oreo', name: 'Extra Remahan Oreo', price: 3000, icon: '🍪' },
  { id: 'boba', name: 'Boba Brown Sugar Kenyal', price: 3000, icon: '🧋' },
  { id: 'choco-chips', name: 'Choco Chips Crispy', price: 2000, icon: '🍫' },
  { id: 'almond', name: 'Roasted Almond Panggang', price: 3000, icon: '🥜' },
];

export const SERVING_OPTIONS = [
  { id: 'cone', name: 'Waffle Cone Renyah', price: 0, icon: '🍦', desc: 'Renyah & gurih dipanggang fresh' },
  { id: 'cup', name: 'Cup Ramah Lingkungan', price: 0, icon: '🍨', desc: 'Bebas lelehan di tangan & praktis' },
];

export const SIZE_OPTIONS = [
  { id: 'single', name: 'Single Scoop', price: 15000, scoops: 1, desc: 'Porsi pas untuk nikmat pribadi' },
  { id: 'double', name: 'Double Scoop', price: 25000, scoops: 2, desc: 'Lebih puas & hemat Rp 5.000!' },
];
