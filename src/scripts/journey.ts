// Scroll-controlled walk into the concept house.
//
// What it is: a Higgsfield-generated camera move (exterior -> threshold ->
// foyer), cut into still frames and drawn to a <canvas> according to scroll
// position. It is not a navigable 3D model. Scroll position is the only clock:
// forward walks in, backward walks out, stopping holds the frame.
//
// Loading: frames arrive coarse-to-fine (every 16th, then 8th, 4th, 2nd, 1st)
// as compressed blobs, nearest to the current position first. Decoding is one
// frame at a time (the current target, then one ahead in the direction of
// travel); requests made obsolete by further scrolling are dropped. A small LRU
// bounds decoded memory. If the exact frame is not ready, the nearest decoded
// frame is shown at full resolution, so motion can get steppier on a slow link
// but never blurrier, and a late decode never replaces a closer frame.
//
// Per scroll event the script reads only scrollY (geometry is measured on load
// and resize) and writes styles only to the elements that fade, only on change.

type Set = { base: string; count: number; w: number; h: number };

const root = document.querySelector<HTMLElement>('[data-journey]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const conn = (navigator as any).connection;
const saveData = !!conn?.saveData;

if (root && document.documentElement.classList.contains('walk') && !reduce.matches && !saveData) {
  const stage = root.querySelector<HTMLElement>('.journey-stage')!;
  const canvas = root.querySelector<HTMLCanvasElement>('.journey-canvas')!;
  const ctx = canvas.getContext('2d', { alpha: false })!;
  const manifest = JSON.parse(root.dataset.frames!);
  const sets = manifest as Record<'land' | 'port', Set[]>;
  // Frames are not evenly spaced in clip time: the fast-moving stretch (approach
  // to threshold) keeps every source frame, the rest every second one. Scroll
  // maps linearly to clip time; lut[time] is the nearest available frame.
  const src: number[] = manifest.src;
  const maxSrc = src[src.length - 1];
  const lut = new Int16Array(maxSrc + 1);
  for (let s = 0, j = 0; s <= maxSrc; s++) {
    while (j + 1 < src.length && Math.abs(src[j + 1] - s) <= Math.abs(src[j] - s)) j++;
    lut[s] = j;
  }
  root.classList.add('is-live');

  let set: Set;
  let blobs: (Blob | undefined)[] = [];
  const bitmaps = new Map<number, ImageBitmap>(); // LRU by insertion order
  const LRU = innerWidth < 720 ? 6 : 8;
  let shown = -1;
  let target = 0;
  let progress = 0;
  let raf = 0;
  let loadToken = 0;

  const slow = /(^|-)2g|3g/.test(conn?.effectiveType ?? '');
  const pickSet = () => {
    const portrait = innerWidth / innerHeight < 0.8;
    const list = portrait ? sets.port : sets.land;
    if (slow) return list[0];
    const dpr = Math.min(devicePixelRatio || 1, 2);
    // pixels the frame needs to cover the stage (object-fit: cover)
    const need = (s: Set) => Math.max(innerWidth, innerHeight * (s.w / s.h)) * dpr;
    return list.find((s) => s.w >= need(s) * 0.9) ?? list[list.length - 1];
  };

  // Stage 1 (after first paint): a coarse pass, every 12th position plus the
  // resting shot, about an eighth of the bytes. Stage 2 (only once the visitor
  // scrolls into the walk): everything else, coarse-to-fine.
  const order = (n: number, steps: number[]) => {
    const out: number[] = [];
    const seen = new Set<number>();
    const add = (i: number) => { if (i >= 0 && i < n && !seen.has(i)) { seen.add(i); out.push(i); } };
    add(0); add(n - 1);
    for (const step of steps) for (let i = 0; i < n; i += step) add(i);
    return out;
  };
  let stage2 = false;

  const url = (i: number) => `${set.base}${String(i).padStart(3, '0')}.webp`;

  let loadedAny = false;
  const inflight = new Set<string>();
  async function load(token: number, queue: number[]) {
    // Each free slot takes the frame nearest to where the visitor is *now*,
    // so a fast swipe ahead re-prioritises the downloads.
    const todo = new Set(queue);
    const pick = () => { let best = -1; for (const i of todo) if (best < 0 || Math.abs(i - target) < Math.abs(best - target)) best = i; todo.delete(best); return best; };
    const worker = async () => {
      while (todo.size && token === loadToken) {
        const i = pick();
        const u = url(i);
        if (blobs[i] || inflight.has(u)) continue;
        inflight.add(u);
        try {
          const r = await fetch(u);
          if (!r.ok) continue;
          const b = await r.blob();
          if (token !== loadToken) return;
          blobs[i] = b;
          loadedAny = true;
          if (i === target || shown === -1 || Math.abs(i - target) < Math.abs(shown - target)) schedule();
        } catch { /* keep going; nearest frame covers gaps */ }
        finally { inflight.delete(u); }
        // From the HTTP cache, fetches resolve almost instantly; without a yield
        // the whole set completes in one burst and blocks a frame (~80 ms seen).
        await new Promise((r) => setTimeout(r, 0));
      }
    };
    await Promise.all([worker(), worker(), worker(), worker()]);
  }

  // One decode at a time. While it runs, only the latest request is kept.
  let busy = false;
  let queued = -1;
  const decode = (i: number) => {
    if (bitmaps.has(i) || !blobs[i]) return;
    if (busy) { queued = i; return; }
    busy = true;
    const gen = loadToken;
    createImageBitmap(blobs[i]!).then((bm) => {
      if (gen !== loadToken) { bm.close(); return; }
      bitmaps.set(i, bm);
      while (bitmaps.size > LRU) {
        const k = [...bitmaps.keys()].find((x) => x !== target && x !== shown);
        if (k === undefined) break;
        bitmaps.get(k)!.close(); bitmaps.delete(k);
      }
    }).catch(() => {}).finally(() => {
      busy = false;
      const next = queued; queued = -1;
      // drop work the visitor has already scrolled past
      if (next >= 0 && Math.abs(next - target) <= 2) decode(next);
      else if (!bitmaps.has(target)) decode(target);
      schedule();
    });
  };

  const nearestLoaded = (i: number) => {
    for (let d = 0; d < set.count; d++) {
      if (bitmaps.has(i - d) ) return i - d;
      if (bitmaps.has(i + d)) return i + d;
    }
    for (let d = 0; d < set.count; d++) {
      if (blobs[i - d]) return i - d;
      if (blobs[i + d]) return i + d;
    }
    return -1;
  };

  const sizeCanvas = () => {
    const r = stage.getBoundingClientRect();
    const scale = Math.min(devicePixelRatio || 1, 2);
    // never allocate more pixels than the frames have
    const k = Math.min(scale, Math.max(set.w / r.width, set.h / r.height));
    canvas.width = Math.round(r.width * k);
    canvas.height = Math.round(r.height * k);
    shown = -1;
  };

  const draw = (bm: ImageBitmap) => {
    const cw = canvas.width, ch = canvas.height;
    const s = Math.max(cw / bm.width, ch / bm.height); // cover
    const w = bm.width * s, h = bm.height * s;
    // anchor: centre horizontally (the doorway), slightly low vertically on portrait
    const y = (ch - h) * (cw < ch ? 0.62 : 0.5);
    ctx.drawImage(bm, (cw - w) / 2, y, w, h);
  };

  // After switching frame sets (resize/rotate), keep the current picture until
  // the new set's exact frame is decoded, instead of showing nearby frames.
  let holding = false;

  function render() {
    raf = 0;
    const want = target;
    if (holding) {
      if (!bitmaps.has(want)) { decode(want); return; }
      holding = false;
      sizeCanvas();
    }
    const have = bitmaps.has(want) ? want : nearestLoaded(want);
    if (have < 0) return;
    const bm = bitmaps.get(have);
    // never swap to a frame that is no closer to where the visitor is
    if (bm && have !== shown && (shown < 0 || Math.abs(have - want) < Math.abs(shown - want))) {
      draw(bm);
      shown = have;
      root!.classList.add('has-frame');
      root!.dataset.frame = String(have);
    }
    if (!bitmaps.has(want)) decode(blobs[want] ? want : have);
    else decode(want + dir); // one ahead in the direction of travel
  }
  const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };

  // Geometry is measured on start and resize only, never per scroll event.
  let geoStart = 0, geoRange = 1;
  const measure = () => {
    const stick = parseFloat(getComputedStyle(stage).top) || 0; // the stage sticks below the header
    geoStart = root!.getBoundingClientRect().top + scrollY - stick;
    geoRange = Math.max(1, root!.offsetHeight - stage.offsetHeight);
  };
  const range = () => geoRange;
  const startY = () => geoStart;
  const readProgress = () => Math.min(1, Math.max(0, (scrollY - geoStart) / geoRange));

  // Fades, written only to the three elements that fade, only when they change.
  // The headline lives in a band above the stage; only the settle panel fades.
  const intro = root.querySelector<HTMLElement>('.journey-intro');
  const settleEl = root.querySelector<HTMLElement>('.journey-settle')!;
  const shade = root.querySelector<HTMLElement>('.journey-shade');
  const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
  const last = { intro: '', settle: '', shade: '', introT: '', introInert: false, settleInert: true };
  const setFades = (p: number) => {
    const io = clamp01(1 - (p - 0.04) * 7).toFixed(2);
    const it = 'translateY(' + Math.round(Math.min(p, 0.2) * -64) + 'px)';
    const so = clamp01((p - 0.88) * 12).toFixed(2);
    const sh = clamp01(1 - (p - 0.04) * 5).toFixed(2);
    if (intro && io !== last.intro) { intro.style.opacity = io; last.intro = io; }
    if (intro && it !== last.introT) { intro.style.transform = it; last.introT = it; }
    if (so !== last.settle) { settleEl.style.opacity = so; last.settle = so; }
    if (shade && sh !== last.shade) { shade.style.opacity = sh; last.shade = sh; }
    const ii = p > 0.2, si = p <= 0.9;
    if (intro && ii !== last.introInert) { intro.inert = ii; last.introInert = ii; }
    if (si !== last.settleInert) { settleEl.inert = si; last.settleInert = si; }
  };
  let dir = 1;
  // Frames wait for the page itself: start after the load event.
  const ready = new Promise<void>((r) => (document.readyState === 'complete' ? r() : addEventListener('load', () => setTimeout(r, 150), { once: true })));
  let resizeT = 0;

  const apply = () => {
    if (resizeT || !root!.classList.contains('is-live')) return; // hold the picture while the layout settles
    progress = readProgress();
    if (progress > 0) beginStage2();
    const t = lut[Math.round(progress * maxSrc)];
    if (t !== target) dir = t > target ? 1 : -1;
    target = t;
    setFades(progress);
    const phase = progress < 0.3 ? 0 : progress < 0.62 ? 1 : progress < 0.8 ? 2 : 3;
    if (root!.dataset.phase !== String(phase)) root!.dataset.phase = String(phase);
    if (target !== shown) schedule();
  };

  const start = (s: Set, keepPicture = false) => {
    set = s;
    blobs = new Array(s.count);
    bitmaps.forEach((b) => b.close());
    bitmaps.clear();
    holding = keepPicture && shown !== -1;
    busy = false; queued = -1;
    if (!holding) sizeCanvas();
    measure();
    apply();
    const token = ++loadToken;
    ready.then(() => load(token, order(s.count, [24, 12]))).then(() => { if (stage2 && token === loadToken) load(token, order(s.count, [4, 2, 1])); });
  };
  const beginStage2 = () => {
    if (stage2) return;
    stage2 = true;
    const token = loadToken;
    ready.then(() => load(token, order(set.count, [4, 2, 1])));
  };

  start(pickSet());
  // Reloaded part-way down: don't flash the exterior poster.
  if (progress > 0.02) root.classList.add('is-mid');

  // Media failed (blocked, offline, 404): fall back to the static composition.
  const fallback = () => { loadToken++; root!.classList.remove('is-live', 'has-frame', 'is-mid'); root!.classList.add('is-static'); };
  if (!('createImageBitmap' in window)) fallback();
  const poster = root.querySelector<HTMLImageElement>('.journey-poster img')!;
  if (poster.complete && !poster.naturalWidth) fallback();
  else poster.addEventListener('error', fallback, { once: true });
  ready.then(() => setTimeout(() => { if (!loadedAny) fallback(); }, 6000));
  addEventListener('scroll', apply, { passive: true });
  ready.then(() => { measure(); apply(); }); // fonts/images may have settled the layout

  // Resize/rotate: keep the same progress instead of sweeping through scenes.
  let held = progress;
  addEventListener('resize', () => {
    if (!resizeT) held = progress;
    clearTimeout(resizeT);
    resizeT = window.setTimeout(() => {
      resizeT = 0;
      const s = pickSet();
      if (s.base !== set.base) start(s, true); else { sizeCanvas(); measure(); }
      const top = startY();
      if (held > 0 && held < 1) scrollTo({ top: top + held * range(), behavior: 'instant' as ScrollBehavior });
      apply();
    }, 120);
  });

  root.querySelector('[data-replay]')?.addEventListener('click', () => {
    scrollTo({ top: Math.max(0, startY()), behavior: 'smooth' });
  });

  // If the user switches to reduced motion mid-visit, fall back to the still.
  reduce.addEventListener('change', () => { if (reduce.matches) location.reload(); });
}
