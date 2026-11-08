// Gallery lightbox on a native <dialog>: focus handling, Esc and backdrop
// close come from the platform. Inside, every photo sits on a scroll-snap
// strip, so touch swipes natively; buttons and arrow keys move one photo.
const dlg = document.querySelector<HTMLDialogElement>('[data-viewer]');
if (dlg) {
  const items = [...document.querySelectorAll<HTMLButtonElement>('[data-gallery-item]')];
  const track = dlg.querySelector<HTMLElement>('[data-viewer-track]')!;
  const counter = dlg.querySelector<HTMLElement>('[data-viewer-count]')!;
  const tpl = counter.dataset.template!;
  const rtl = document.documentElement.dir === 'rtl';
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const n = items.length;
  let i = 0, raf = 0;
  let opener: HTMLElement | null = null;

  const label = () => { counter.textContent = tpl.replace('{i}', String(i + 1)).replace('{n}', String(n)); };
  // scrollLeft runs negative in RTL; slides are exactly one track wide.
  const go = (to: number, smooth = true) => {
    const wrap = to < 0 || to >= n;
    i = (to + n) % n;
    label();
    track.scrollTo({ left: (rtl ? -1 : 1) * i * track.clientWidth, behavior: smooth && !wrap && !still.matches ? 'smooth' : 'instant' });
  };
  track.addEventListener('scroll', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const at = Math.min(n - 1, Math.round(Math.abs(track.scrollLeft) / Math.max(1, track.clientWidth)));
      if (at !== i) { i = at; label(); }
    });
  }, { passive: true });

  items.forEach((b, k) => b.addEventListener('click', () => { opener = b; dlg.showModal(); go(k, false); }));
  dlg.querySelector('[data-prev]')!.addEventListener('click', () => go(i - 1));
  dlg.querySelector('[data-next]')!.addEventListener('click', () => go(i + 1));
  dlg.querySelector('[data-close]')!.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    go(i + ((e.key === 'ArrowRight') !== rtl ? 1 : -1));
  });
  dlg.addEventListener('close', () => opener?.focus());
  addEventListener('resize', () => { if (dlg.open) go(i, false); });
}

// "Back to properties" returns to the last search, filters intact.
document.querySelectorAll<HTMLAnchorElement>('[data-back]').forEach((a) => {
  try {
    const q = sessionStorage.getItem('abd-last-search');
    if (q) a.href = a.pathname + q;
  } catch {}
  a.addEventListener('click', (e) => {
    const ref = document.referrer ? new URL(document.referrer) : null;
    if (ref && ref.origin === location.origin && ref.pathname === a.pathname && history.length > 1) {
      e.preventDefault();
      history.back();
    }
  });
});
