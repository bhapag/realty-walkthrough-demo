// FICTIONAL SAMPLE LISTINGS for the demo. Every price, size, room count,
// feature and availability here is invented. Replace with confirmed inventory.
import type { HoodId } from './neighbourhoods';
import type { ImageKey } from './images';

export type Deal = 'buy' | 'rent';
export type PropertyType = 'apartment' | 'garden' | 'penthouse';

export interface Property {
  id: string;
  deal: Deal;
  hood: HoodId;
  type: PropertyType;
  price: number; // ILS; monthly when deal is 'rent'
  rooms: number; // Israeli count, includes the living room
  bedrooms: number;
  bathrooms: number;
  size: number; // built m²
  outdoor?: { kind: 'balcony' | 'garden' | 'terrace'; size: number };
  floor: number;
  floors: number;
  images: ImageKey[];
  title: { en: string; he: string };
  summary: { en: string; he: string };
  description: { en: string[]; he: string[] };
  features: { en: string[]; he: string[] };
  featured?: boolean;
}

export const properties: Property[] = [
  {
    id: 'sample-01',
    deal: 'buy',
    hood: 'rehavia',
    type: 'apartment',
    price: 4650000,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    size: 108,
    outdoor: { kind: 'balcony', size: 9 },
    floor: 2,
    floors: 3,
    images: ['living', 'kitchen', 'bedroomStone', 'balcony', 'study'],
    title: { en: 'Arched-window apartment on a quiet street', he: 'דירה עם חלונות קשתיים ברחוב שקט' },
    summary: {
      en: 'Four rooms in a three-storey stone building, with a pergola balcony.',
      he: 'ארבעה חדרים בבניין אבן בן שלוש קומות, עם מרפסת ופרגולה.',
    },
    description: {
      en: [
        'A second-floor apartment in a small stone building. The living room has two deep arched windows and one wall of exposed stone.',
        'Three bedrooms, one of them used here as a study. The kitchen opens towards the dining area, and the balcony sits under a timber pergola.',
      ],
      he: [
        'דירה בקומה השנייה בבניין אבן קטן. בסלון שני חלונות קשתיים עמוקים וקיר אבן חשוף אחד.',
        'שלושה חדרי שינה, שאחד מהם משמש כאן כחדר עבודה. המטבח פתוח לפינת האוכל, והמרפסת מקורה בפרגולת עץ.',
      ],
    },
    features: {
      en: ['Arched windows', 'Balcony with pergola', 'Storage room', 'Safe room (mamad)'],
      he: ['חלונות קשתיים', 'מרפסת עם פרגולה', 'מחסן', 'ממ״ד'],
    },
    featured: true,
  },
  {
    id: 'sample-02',
    deal: 'buy',
    hood: 'german-colony',
    type: 'garden',
    price: 5900000,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    size: 132,
    outdoor: { kind: 'garden', size: 60 },
    floor: 0,
    floors: 2,
    images: ['courtyard', 'dining', 'entrance'],
    title: { en: 'Garden apartment with a lemon tree', he: 'דירת גן עם עץ לימון' },
    summary: {
      en: 'Ground floor, five rooms, and a private stone courtyard.',
      he: 'קומת קרקע, חמישה חדרים וחצר אבן פרטית.',
    },
    description: {
      en: [
        'A ground-floor home that opens onto a private courtyard paved in stone, with a lemon tree and space for an outdoor table.',
        'Four bedrooms and a long dining area suit a family that eats together.',
      ],
      he: [
        'דירת קרקע שנפתחת לחצר פרטית מרוצפת אבן, עם עץ לימון ומקום לשולחן בחוץ.',
        'ארבעה חדרי שינה ופינת אוכל ארוכה מתאימים למשפחה שאוהבת לשבת יחד.',
      ],
    },
    features: {
      en: ['Private garden', 'Step-free entrance', 'Storage room'],
      he: ['גינה פרטית', 'כניסה ללא מדרגות', 'מחסן'],
    },
    featured: true,
  },
  {
    id: 'sample-03',
    deal: 'buy',
    hood: 'arnona',
    type: 'penthouse',
    price: 6800000,
    rooms: 5,
    bedrooms: 3,
    bathrooms: 3,
    size: 140,
    outdoor: { kind: 'terrace', size: 70 },
    floor: 6,
    floors: 6,
    images: ['penthouse', 'study', 'bedroomStone'],
    title: { en: 'Penthouse with a planted roof terrace', he: 'פנטהאוז עם מרפסת גג מגוננת' },
    summary: {
      en: 'Top floor, five rooms, and a terrace with olive trees.',
      he: 'קומה עליונה, חמישה חדרים ומרפסת עם עצי זית.',
    },
    description: {
      en: [
        'The top floor of a newer building, with a wide roof terrace planted with olive trees and lavender.',
        'Five rooms: three bedrooms, a study and the living space that opens to the terrace.',
      ],
      he: [
        'הקומה העליונה בבניין חדש יחסית, עם מרפסת גג רחבה ובה עצי זית ולבנדר.',
        'חמישה חדרים: שלושה חדרי שינה, חדר עבודה וחלל מגורים הנפתח אל המרפסת.',
      ],
    },
    features: {
      en: ['Roof terrace', 'Lift', 'Two parking spaces', 'Safe room (mamad)'],
      he: ['מרפסת גג', 'מעלית', 'שתי חניות', 'ממ״ד'],
    },
    featured: true,
  },
  {
    id: 'sample-04',
    deal: 'rent',
    hood: 'katamon',
    type: 'apartment',
    price: 7800,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    size: 72,
    floor: 1,
    floors: 4,
    images: ['rentalLiving', 'rentalBedroom'],
    title: { en: 'Bright three-room rental', he: 'דירת שלושה חדרים מוארת להשכרה' },
    summary: {
      en: 'Two bedrooms on a residential street, available to rent.',
      he: 'שני חדרי שינה ברחוב מגורים, להשכרה.',
    },
    description: {
      en: [
        'A first-floor apartment with a large window over the street and a simple open living and dining space.',
        'Two bedrooms and one bathroom. Sample rental terms only.',
      ],
      he: [
        'דירה בקומה הראשונה עם חלון גדול לרחוב וחלל מגורים ופינת אוכל פתוחים.',
        'שני חדרי שינה וחדר רחצה אחד. תנאי שכירות לדוגמה בלבד.',
      ],
    },
    features: {
      en: ['Furnished option', 'Air conditioning', 'Bike storage'],
      he: ['אפשרות לריהוט', 'מיזוג אוויר', 'מחסן אופניים'],
    },
  },
  {
    id: 'sample-05',
    deal: 'rent',
    hood: 'baka',
    type: 'apartment',
    price: 11500,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    size: 98,
    outdoor: { kind: 'balcony', size: 12 },
    floor: 2,
    floors: 4,
    images: ['dining', 'bedroomStone'],
    title: { en: 'Family rental with a long dining room', he: 'דירה משפחתית להשכרה עם פינת אוכל גדולה' },
    summary: {
      en: 'Four rooms and a balcony, for a family that needs space.',
      he: 'ארבעה חדרים ומרפסת, למשפחה שצריכה מקום.',
    },
    description: {
      en: [
        'A second-floor rental with three bedrooms and a dining area large enough for guests.',
        'A balcony runs along the living room. Sample rental terms only.',
      ],
      he: [
        'דירה להשכרה בקומה השנייה, עם שלושה חדרי שינה ופינת אוכל שמתאימה גם לאורחים.',
        'מרפסת לאורך הסלון. תנאי שכירות לדוגמה בלבד.',
      ],
    },
    features: {
      en: ['Balcony', 'Lift', 'Parking space', 'Safe room (mamad)'],
      he: ['מרפסת', 'מעלית', 'חניה', 'ממ״ד'],
    },
  },
  {
    id: 'sample-06',
    deal: 'buy',
    hood: 'talbiya',
    type: 'apartment',
    price: 3450000,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    size: 74,
    floor: 1,
    floors: 3,
    images: ['entrance', 'kitchen', 'rentalBedroom'],
    title: { en: 'Three rooms behind an arched gate', he: 'שלושה חדרים מאחורי שער מקושת' },
    summary: {
      en: 'A compact first-floor apartment in an older stone building.',
      he: 'דירה קומפקטית בקומה הראשונה בבניין אבן ותיק.',
    },
    description: {
      en: [
        'Reached through an arched iron gate and a short flight of stone steps.',
        'Two bedrooms and a kitchen with a small arched window. A practical first home or pied-à-terre.',
      ],
      he: [
        'הכניסה דרך שער ברזל מקושת ומדרגות אבן קצרות.',
        'שני חדרי שינה ומטבח עם חלון קשתי קטן. מתאימה כדירה ראשונה או כדירה לביקורים.',
      ],
    },
    features: {
      en: ['Stone building', 'Shared garden', 'Storage room'],
      he: ['בניין אבן', 'גינה משותפת', 'מחסן'],
    },
  },
];

export const propertyById = Object.fromEntries(properties.map((p) => [p.id, p]));
