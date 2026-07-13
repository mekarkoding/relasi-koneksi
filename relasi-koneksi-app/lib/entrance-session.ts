const ENTRANCE_DONE_KEY = "relasi-entrance-done";

export function hasCompletedEntrance(): boolean {
  try {
    return sessionStorage.getItem(ENTRANCE_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markEntranceCompleted(): void {
  try {
    sessionStorage.setItem(ENTRANCE_DONE_KEY, "1");
  } catch {
    /* private mode / blocked storage */
  }
}
