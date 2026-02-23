import type { JSX } from "solid-js";

export function EntryForm(props: {
  stepLabel: string;
  title: string;
  subtitle: string;
  label: string;
  saveLabel: string;
  value: string;
  onValueInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent>;
}): JSX.Element {
  return (
    <section id="entry-view" class="view">
      <form id="rating-form" class="card card-eval" autocomplete="off" onSubmit={props.onSubmit}>
        <p class="step-label">{props.stepLabel}</p>
        <h2 class="form-title">{props.title}</h2>
        <p class="form-subtitle">{props.subtitle}</p>

        <label id="rating-label" for="rating" class="label">
          {props.label}
        </label>

        <div class="slider-row">
          <input id="rating" name="rating" type="range" min="1" max="10" step="1" value={props.value} onInput={props.onValueInput} />
          <output id="rating-value" for="rating" class="rating-pill" aria-live="polite">
            {props.value}/10
          </output>
        </div>

        <div class="scale-labels" aria-hidden="true">
          <span>1</span>
          <span>10</span>
        </div>

        <button id="save-rating" class="btn btn-primary" type="submit">
          {props.saveLabel}
        </button>
      </form>
    </section>
  );
}
