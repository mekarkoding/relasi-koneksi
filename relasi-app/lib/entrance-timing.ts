/**
 * Scroll-progress windows for the home entrance journey:
 * gapura → forest passage → landing reveal.
 *
 * Landing hero fades in *over* the forest/gapura so the blue mist
 * fully covers them by the end (no leftover green/gate on the landing).
 */
/** Gapura zoom + fade out */
export const GATE_ZOOM_END = 0.36;
export const GATE_FADE_START = 0.18;
export const GATE_FADE_END = 0.36;

/** Forest tunnel — fully gone before landing finishes */
export const FOREST_ZOOM_START = 0.08;
export const FOREST_ZOOM_END = 0.58;
export const FOREST_FADE_START = 0.4;
export const FOREST_FADE_END = 0.62;

/** Landing hero mist + copy fade in on top */
export const ENTRANCE_REVEAL_START = 0.52;
export const ENTRANCE_REVEAL_END = 0.78;

/** Mark entrance done for this tab session */
export const ENTRANCE_COMPLETE_AT = 0.88;

/** sessionStorage key — cleared when the tab/window closes */
export const ENTRANCE_SEEN_KEY = "relasi:entrance-seen";

export function readEntranceSeen(): boolean {
  try {
    return sessionStorage.getItem(ENTRANCE_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeEntranceSeen(): void {
  try {
    sessionStorage.setItem(ENTRANCE_SEEN_KEY, "1");
  } catch {
    /* private mode / blocked storage */
  }
}
