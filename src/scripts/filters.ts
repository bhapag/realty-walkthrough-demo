// Property filters. State lives in the URL query so refresh, back/forward,
// sharing and the language switch all keep it.
export type Filters = { deal: string; hood: string; type: string; max: string; beds: string };
type CardData = { deal: string; hood: string; type: string; price: number; beds: number };

export function matches(c: CardData, f: Filters) {
  if (f.deal && c.deal !== f.deal) return false;
  if (f.hood && c.hood !== f.hood) return false;
  if (f.type && c.type !== f.type) return false;
  if (f.deal && f.max && c.price > Number(f.max)) return false;
  if (f.beds && c.beds < Number(f.beds)) return false;
  return true;
}

const form = document.querySelector<HTMLFormElement>('[data-filters]');
if (form) {
  const cards = [...document.querySelectorAll<HTMLElement>('[data-card]')];
  const count = document.querySelector<HTMLElement>('[data-count]')!;
  const empty = document.querySelector<HTMLElement>('[data-empty]')!;
  const max = form.elements.namedItem('max') as HTMLSelectElement;
  const maxHint = document.getElementById('max-hint')!;
  const budgets = JSON.parse(form.dataset.budgets!) as Record<string, { v: number; label: string }[]>;
  const anyLabel = form.dataset.anyLabel!;
  const resultText = form.dataset.results!;
  const keys = ['deal', 'hood', 'type', 'max', 'beds'] as const;

  const read = (): Filters => {
    const d = new FormData(form);
    return Object.fromEntries(keys.map((k) => [k, String(d.get(k) ?? '')])) as Filters;
  };

  const fillBudget = (deal: string, keep: string) => {
    max.replaceChildren(new Option(anyLabel, ''));
    for (const b of budgets[deal] ?? []) max.add(new Option(b.label, String(b.v)));
    max.disabled = !deal;
    maxHint.hidden = !!deal;
    max.value = [...max.options].some((o) => o.value === keep) ? keep : '';
  };

  const apply = (f: Filters, push = false) => {
    let shown = 0;
    for (const el of cards) {
      const ok = matches(
        { deal: el.dataset.deal!, hood: el.dataset.hood!, type: el.dataset.type!, price: Number(el.dataset.price), beds: Number(el.dataset.beds) },
        f,
      );
      el.hidden = !ok;
      if (ok) shown++;
    }
    count.textContent = resultText.replace('{n}', String(shown)).replace('{total}', String(cards.length));
    empty.hidden = shown > 0;
    const q = new URLSearchParams();
    for (const k of keys) if (f[k]) q.set(k, f[k]);
    const url = location.pathname + (q.toString() ? `?${q}` : '');
    if (url !== location.pathname + location.search) history[push ? 'pushState' : 'replaceState'](null, '', url);
    try { sessionStorage.setItem('abd-last-search', location.search); } catch {}
  };

  const fromUrl = () => {
    const q = new URLSearchParams(location.search);
    for (const k of keys) {
      if (k === 'deal') {
        const v = q.get('deal') ?? '';
        form.querySelectorAll<HTMLInputElement>('input[name="deal"]').forEach((r) => (r.checked = r.value === v));
      } else if (k !== 'max') {
        const el = form.elements.namedItem(k) as HTMLSelectElement;
        el.value = [...el.options].some((o) => o.value === q.get(k)) ? q.get(k)! : '';
      }
    }
    fillBudget(q.get('deal') ?? '', q.get('max') ?? '');
    apply(read());
  };

  form.addEventListener('change', (e) => {
    if ((e.target as HTMLElement).getAttribute('name') === 'deal') fillBudget(read().deal, max.value);
    apply(read(), true);
  });
  form.addEventListener('submit', (e) => e.preventDefault());
  document.querySelectorAll('[data-clear]').forEach((b) =>
    b.addEventListener('click', () => {
      form.reset();
      fillBudget('', '');
      apply(read(), true);
      (form.querySelector('input[name="deal"]') as HTMLInputElement).focus();
    }),
  );
  window.addEventListener('popstate', fromUrl);

  // Phones: the fields open as a bottom sheet. Changes apply live underneath;
  // the sheet closes with its button, the backdrop or Escape.
  const panel = document.querySelector<HTMLElement>('[data-filter-panel]')!;
  const toggle = document.querySelector<HTMLButtonElement>('[data-filter-toggle]')!;
  const phone = matchMedia('(max-width: 720px)');
  const setSheet = (open: boolean) => {
    panel.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('menu-open', open && phone.matches);
    if (open) form.querySelector<HTMLElement>('#filter-fields [data-sheet-close]')?.focus();
  };
  toggle.addEventListener('click', () => setSheet(panel.dataset.open !== 'true'));
  form.querySelectorAll('[data-sheet-close]').forEach((b) => b.addEventListener('click', () => { setSheet(false); toggle.focus(); }));
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.dataset.open === 'true') { setSheet(false); toggle.focus(); }
  });
  phone.addEventListener('change', () => setSheet(false));

  fromUrl();
}
