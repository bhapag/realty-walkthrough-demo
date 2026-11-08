// Draft demo notes. General character only: no prices, no forecasts.
export const neighbourhoods = [
  {
    id: 'rehavia',
    name: { en: 'Rehavia', he: 'רחביה' },
    note: {
      en: 'Leafy streets of 1930s stone buildings, close to the city centre.',
      he: 'רחובות ירוקים ובנייני אבן משנות השלושים, קרוב למרכז העיר.',
    },
  },
  {
    id: 'talbiya',
    name: { en: 'Talbiya', he: 'טלביה' },
    note: {
      en: 'Older stone homes and gardens, a short walk from the centre.',
      he: 'בתי אבן ותיקים וגינות, במרחק הליכה קצר מהמרכז.',
    },
  },
  {
    id: 'german-colony',
    name: { en: 'German Colony', he: 'המושבה הגרמנית' },
    note: {
      en: 'Cafés along Emek Refaim, with Templer-era houses on the side streets.',
      he: 'בתי קפה לאורך עמק רפאים, ובתים מתקופת הטמפלרים ברחובות הצדדיים.',
    },
  },
  {
    id: 'baka',
    name: { en: 'Baka', he: 'בקעה' },
    note: {
      en: 'Residential streets mixing older houses with newer buildings.',
      he: 'רחובות מגורים שמשלבים בתים ותיקים עם בניינים חדשים יותר.',
    },
  },
  {
    id: 'katamon',
    name: { en: 'Katamon', he: 'קטמון' },
    note: {
      en: 'Mid-century apartment buildings on quiet residential streets.',
      he: 'בנייני דירות מאמצע המאה הקודמת ברחובות מגורים שקטים.',
    },
  },
  {
    id: 'arnona',
    name: { en: 'Arnona', he: 'ארנונה' },
    note: {
      en: 'Southern Jerusalem, with newer projects and open views in places.',
      he: 'דרום ירושלים, עם פרויקטים חדשים יותר ונוף פתוח במקומות מסוימים.',
    },
  },
] as const;

export type HoodId = (typeof neighbourhoods)[number]['id'];
export const hoodById = Object.fromEntries(neighbourhoods.map((n) => [n.id, n])) as Record<
  HoodId,
  (typeof neighbourhoods)[number]
>;
