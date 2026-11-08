// All images are Higgsfield generations (see assets-source/ASSETS.md).
// They illustrate the demo; none shows a real listing or a documented place.
import heroTerrace from '../assets/img/00-hero-terrace-2k.jpg'; // classic demo hero (2K upscale)
import journeyExt from '../assets/img/journey/ext-land.jpg';
import journeyExtPort from '../assets/img/journey/ext-port.jpg';
import journeyIn from '../assets/img/journey/in-land.jpg';
import journeyInPort from '../assets/img/journey/in-port.jpg';
import stone from '../assets/img/01-stone-texture.png';
import living from '../assets/img/02-living-arched.png';
import kitchen from '../assets/img/03-kitchen.png';
import bedroomStone from '../assets/img/04-bedroom-stone.png';
import balcony from '../assets/img/05-balcony-pergola.png';
import rentalLiving from '../assets/img/06-rental-living.png';
import courtyard from '../assets/img/07-garden-courtyard.png';
import penthouse from '../assets/img/08-penthouse-terrace.png';
import dining from '../assets/img/09-family-dining.png';
import entrance from '../assets/img/10-stone-entrance.png';
import keys from '../assets/img/11-keys-sill.png';
import rentalBedroom from '../assets/img/12-rental-bedroom.png';
import study from '../assets/img/13-study-nook.png';

export const images = {
  heroTerrace: {
    src: heroTerrace,
    alt: { en: 'A stone doorway opening onto a sunlit terrace with an olive tree', he: 'פתח אבן הנפתח אל מרפסת מוארת בשמש ועץ זית' },
  },
  // The concept house: one property, exterior to foyer (see assets-source/ASSETS.md)
  journeyExt: {
    src: journeyExt,
    alt: { en: 'A two-storey Jerusalem-stone house with its arched front doors open, seen from the garden path', he: 'בית אבן ירושלמי בן שתי קומות, דלתות הכניסה המקושתות פתוחות, במבט משביל הגינה' },
  },
  journeyExtPort: { src: journeyExtPort, alt: { en: '', he: '' } },
  journeyIn: {
    src: journeyIn,
    alt: { en: 'Inside the same house: the foyer, with a stone arch opening onto the living room and terrace doors', he: 'בתוך אותו בית: המבואה, וקשת אבן שנפתחת אל הסלון ודלתות המרפסת' },
  },
  journeyInPort: { src: journeyInPort, alt: { en: '', he: '' } },
  stone: { src: stone, alt: { en: '', he: '' } },
  living: {
    src: living,
    alt: { en: 'Living room with arched windows and an exposed stone wall', he: 'סלון עם חלונות קשתיים וקיר אבן חשוף' },
  },
  kitchen: {
    src: kitchen,
    alt: { en: 'Kitchen with pale stone counters and an arched window', he: 'מטבח עם משטחי אבן בהירים וחלון קשתי' },
  },
  bedroomStone: {
    src: bedroomStone,
    alt: { en: 'Bedroom with thick stone walls and a deep window seat', he: 'חדר שינה עם קירות אבן עבים וגומחת חלון עמוקה' },
  },
  balcony: {
    src: balcony,
    alt: { en: 'Balcony with a wooden pergola over stone rooftops', he: 'מרפסת עם פרגולת עץ מעל גגות אבן' },
  },
  rentalLiving: {
    src: rentalLiving,
    alt: { en: 'Bright compact living and dining area', he: 'סלון ופינת אוכל קומפקטיים ומוארים' },
  },
  courtyard: {
    src: courtyard,
    alt: { en: 'Private stone courtyard with a lemon tree', he: 'חצר אבן פרטית עם עץ לימון' },
  },
  penthouse: {
    src: penthouse,
    alt: { en: 'Rooftop terrace with olive trees at dusk', he: 'מרפסת גג עם עצי זית בשעת בין ערביים' },
  },
  dining: {
    src: dining,
    alt: { en: 'Dining area with a long oak table and stone wall', he: 'פינת אוכל עם שולחן אלון ארוך וקיר אבן' },
  },
  entrance: {
    src: entrance,
    alt: { en: 'Arched entrance to a small stone building', he: 'כניסה מקושתת לבניין אבן קטן' },
  },
  keys: {
    src: keys,
    alt: { en: 'House keys on a stone windowsill', he: 'מפתחות בית על אדן חלון מאבן' },
  },
  rentalBedroom: {
    src: rentalBedroom,
    alt: { en: 'Small bright bedroom with plants on the sill', he: 'חדר שינה קטן ומואר עם צמחים על אדן החלון' },
  },
  study: {
    src: study,
    alt: { en: 'Study nook with oak shelves and an arched window', he: 'פינת עבודה עם מדפי אלון וחלון קשתי' },
  },
};

export type ImageKey = keyof typeof images;
