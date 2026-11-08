# Realty walkthrough demo

A bilingual (English and Hebrew, with right-to-left layout) real-estate website
demo built with Astro. Its opening is a scroll-scrubbed walk from a garden path
through the front door of a concept house, delivered as image frames.

**Stone Arch Realty is a fictional brand.** It is not a real brokerage or a
customer site, and nothing here is endorsed by any business. All listings and
prices are invented, the neighbourhood notes are general draft copy, and the
images are AI-generated illustrations of a concept property, not photographs of
any real listing.

The enquiry form sends nothing and there is no backend, analytics or lead
collection. Contact details are placeholders and contact actions are off.

## Run it

Requires Node 22 or newer.

```bash
npm install
npm run build
npm run preview
```

Open http://localhost:4410/ (redirects to `/en/`). Hebrew is at `/he/`.

Set `DEMO_VARIANT=classic` when building for the alternative stone-arch hero.

## Where things live

| What | Where |
|---|---|
| Contact placeholders | `src/config/contact.ts` |
| English and Hebrew text | `src/i18n/ui.ts` |
| Fictional sample listings | `src/data/properties.ts` |
| Neighbourhood notes | `src/data/neighbourhoods.ts` |
| Image registry and alt text | `src/data/images.ts` |
| Pages (`/en/…`, `/he/…`) | `src/pages/[lang]/` |
| Styles and tokens | `src/styles/global.css` |
| Behaviour (walk, filters, gallery, form) | `src/scripts/` |
| Walk frames and manifest | `public/media/journey/`, `src/data/journey.json` |

The Hebrew copy is a draft and has not had a native review. `vercel.json` sends
`noindex` headers; remove them if you deploy your own version publicly.

## Licence

Code: [MIT](LICENSE). The images and video were generated with Higgsfield and
are included for demonstration. Check the terms of your own tools before reusing
AI-generated media commercially. Fonts come from the `@fontsource` packages under
their own licences.
