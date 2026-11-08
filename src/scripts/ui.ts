// Small site-wide behaviours: swipe dots, gallery counters, section reveals.
// Each listener is passive and does work only on change.

// Swipeable strips ([data-swiper]): keep the dots/counter in step with the
// visible slide. Works in LTR and RTL (scrollLeft is negative in RTL).
document.querySelectorAll<HTMLElement>('[data-swiper]').forEach((track) => {
  const host = track.closest('.card-media, .gallery-wrap') ?? track.parentElement!;
  const dots = host.querySelectorAll('.card-dots i');
  const counter = host.querySelector<HTMLElement>('[data-swiper-count]');
  const kids = track.children as HTMLCollectionOf<HTMLElement>;
  const n = kids.length;
  let shown = 0, raf = 0;
  const update = () => {
    raf = 0;
    // Slide pitch (slides may be narrower than the strip); the end of the strip is the last slide.
    const x = Math.abs(track.scrollLeft);
    const step = n > 1 ? Math.abs(kids[1].offsetLeft - kids[0].offsetLeft) || 1 : 1;
    const i = x >= track.scrollWidth - track.clientWidth - 2 ? n - 1 : Math.min(n - 1, Math.round(x / step));
    if (i === shown) return;
    dots[shown]?.classList.remove('on');
    dots[i]?.classList.add('on');
    if (counter) counter.textContent = `${i + 1} / ${n}`;
    shown = i;
  };
  track.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
});

// Reveal: sections fade up once as they enter. The hidden state exists only
// once this script runs, so content stays visible without JS, if the script
// fails, and with reduced motion.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reveal');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
}
