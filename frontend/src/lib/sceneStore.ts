/**
 * What the page is currently doing, for the lantern to react to.
 *
 * The scene runs its own rAF loop outside React and reads this object each
 * frame, the same arrangement as pointerStore and scrollStore. Interactions
 * therefore cost a property write, not a re-render: pointing down a list of
 * twelve projects would otherwise re-render the whole section on every row.
 *
 * The mapping that makes this worth doing: the lantern has twelve panels and
 * the portfolio has twelve projects. `panel` is an index into both.
 */
export interface SceneState {
  /** Project/panel the reader is pointing at, or null to let it drift. */
  panel: number | null;
  /** A case is open: the aimed panel lifts away from the body. */
  opened: boolean;
  /** A form field has focus: the light runs inward instead of outward. */
  gathering: boolean;
  /** Set to `performance.now()` to fire a one-shot flare. */
  flareAt: number;
}

export const sceneState: SceneState = {
  panel: null,
  opened: false,
  gathering: false,
  flareAt: 0,
};

/** Turns the lantern to a project's panel. Pass null to release it. */
export function aimAtPanel(panel: number | null) {
  sceneState.panel = panel;
}

export function setCaseOpen(open: boolean) {
  sceneState.opened = open;
}

export function setGathering(gathering: boolean) {
  sceneState.gathering = gathering;
}

/** One bright wave out through the strapwork — used when an order lands. */
export function flare() {
  sceneState.flareAt = performance.now();
}
