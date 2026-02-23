export type UiBindings = {
  titleEl: HTMLHeadingElement;
  localeSelect: HTMLSelectElement;
  localeLabel: HTMLLabelElement;
  themeToggleBtn: HTMLButtonElement;
  statusEl: HTMLParagraphElement;
  signInBtn: HTMLButtonElement;
  tabsEl: HTMLElement;
  entryTab: HTMLButtonElement;
  weekTab: HTMLButtonElement;
  entryView: HTMLElement;
  weekView: HTMLElement;
  ratingForm: HTMLFormElement;
  ratingLabel: HTMLLabelElement;
  saveRatingBtn: HTMLButtonElement;
  ratingInput: HTMLInputElement;
  chartTitle: HTMLParagraphElement;
  chartCanvas: HTMLCanvasElement;
  chartEmpty: HTMLParagraphElement;
};

export function getUiBindings(): UiBindings {
  return {
    titleEl: must<HTMLHeadingElement>("#title"),
    localeSelect: must<HTMLSelectElement>("#locale"),
    localeLabel: must<HTMLLabelElement>("#locale-label"),
    themeToggleBtn: must<HTMLButtonElement>("#theme-toggle"),
    statusEl: must<HTMLParagraphElement>("#status"),
    signInBtn: must<HTMLButtonElement>("#signin"),
    tabsEl: must<HTMLElement>("#tabs"),
    entryTab: must<HTMLButtonElement>("#tab-entry"),
    weekTab: must<HTMLButtonElement>("#tab-week"),
    entryView: must<HTMLElement>("#entry-view"),
    weekView: must<HTMLElement>("#week-view"),
    ratingForm: must<HTMLFormElement>("#rating-form"),
    ratingLabel: must<HTMLLabelElement>("#rating-label"),
    saveRatingBtn: must<HTMLButtonElement>("#save-rating"),
    ratingInput: must<HTMLInputElement>("#rating"),
    chartTitle: must<HTMLParagraphElement>("#chart-title"),
    chartCanvas: must<HTMLCanvasElement>("#chart"),
    chartEmpty: must<HTMLParagraphElement>("#chart-empty"),
  };
}

function must<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing element: ${selector}`);
  }
  return element;
}
