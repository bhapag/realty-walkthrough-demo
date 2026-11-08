// Two demos share this codebase. DEMO_VARIANT=classic builds the stone-arch
// version (the classic build); anything else builds the walk-in.
export const variant: 'walk' | 'classic' =
  (process.env.DEMO_VARIANT ?? import.meta.env.DEMO_VARIANT) === 'classic' ? 'classic' : 'walk';
