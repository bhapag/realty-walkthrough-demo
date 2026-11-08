// The arch: depth on scroll and pointer, plus one short Higgsfield clip on
// capable desktops. Nothing runs while idle; nothing runs with reduced motion.
const arch = document.querySelector<HTMLElement>('[data-arch]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

if (arch && !reduce.matches) {
  const media = arch.querySelector<HTMLElement>('.arch-media')!;
  let visible = true;
  let frame = 0;
  let px = 0, py = 0; // pointer offset, -1..1

  const render = () => {
    frame = 0;
    const r = arch.getBoundingClientRect();
    // 0 at rest, 1 when the arch has scrolled one viewport up
    const p = Math.min(1, Math.max(0, -r.top / innerHeight));
    media.style.setProperty('--ty', `${(p * 5 + py * 1.2).toFixed(2)}%`);
    media.style.setProperty('--tx', `${(px * 1.2).toFixed(2)}%`);
    media.style.setProperty('--s', (1 + p * 0.06).toFixed(4));
  };
  const queue = () => { if (!frame && visible) frame = requestAnimationFrame(render); };

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) queue(); }).observe(arch);
  addEventListener('scroll', queue, { passive: true });
  if (matchMedia('(pointer: fine)').matches) {
    arch.addEventListener('pointermove', (e) => {
      const r = arch.getBoundingClientRect();
      px = -((e.clientX - r.left) / r.width - 0.5) * 2;
      py = -((e.clientY - r.top) / r.height - 0.5) * 2;
      queue();
    });
    arch.addEventListener('pointerleave', () => { px = py = 0; queue(); });
  }

  // Motion clip: desktop-width, no data saver, not on slow connections.
  const conn = (navigator as any).connection;
  const slow = conn && (conn.saveData || /(^|-)2g|3g/.test(conn.effectiveType ?? ''));
  const src = arch.dataset.video;
  // Sharpness guard: the clip is 716 px tall. Where the arch needs far more
  // device pixels than that (e.g. retina desktops), keep the sharp 2K still.
  const sharpEnough = 716 / (arch.getBoundingClientRect().height * devicePixelRatio) >= 0.9;
  if (src && !slow && sharpEnough && matchMedia('(min-width: 861px)').matches) {
    const start = () => {
      const v = document.createElement('video');
      v.muted = true; v.playsInline = true; v.preload = 'auto';
      v.setAttribute('aria-hidden', 'true');
      v.src = src;
      const btn = document.querySelector<HTMLButtonElement>('[data-motion-toggle]')!;
      const label = () => (btn.textContent = v.paused ? btn.dataset.play! : btn.dataset.pause!);
      v.addEventListener('canplaythrough', () => {
        v.classList.add('is-ready');
        v.play().catch(() => {});
        btn.classList.add('is-visible');
        label();
      }, { once: true });
      v.addEventListener('play', label);
      v.addEventListener('pause', label);
      v.addEventListener('ended', label); // rests on its final frame; no loop
      v.addEventListener('error', () => v.remove()); // the still stays
      btn.addEventListener('click', () => {
        if (v.paused) { if (v.ended) v.currentTime = 0; v.play().catch(() => {}); } else v.pause();
      });
      reduce.addEventListener('change', () => { if (reduce.matches) v.pause(); });
      media.append(v);
    };
    if (document.readyState === 'complete') setTimeout(start, 300);
    else addEventListener('load', () => setTimeout(start, 300), { once: true });
  }
}
