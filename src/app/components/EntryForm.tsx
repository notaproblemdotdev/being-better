import type { JSX } from "solid-js";

type IntensityKey = "energy" | "stress" | "anxiety" | "joy";

export function EntryForm(props: {
  visible: boolean;
  title: string;
  wordsLabel: string;
  wordsPlaceholder: string;
  wordCountLabel: string;
  suggestedWordsLabel: string;
  intensityLabels: Record<IntensityKey, string>;
  contextTagsLabel: string;
  customTagPlaceholder: string;
  addTagLabel: string;
  saveLabel: string;
  softLimitHint: string;
  wordsInputValue: string;
  wordCount: number;
  wordLimit: number;
  showWordLimitHint: boolean;
  suggestedWords: ReadonlyArray<{ value: string; label: string }>;
  contextTags: string[];
  presetContextTags: ReadonlyArray<{ value: string; label: string }>;
  selectedContextTags: ReadonlyArray<{ value: string; label: string }>;
  customTagValue: string;
  intensity: Record<IntensityKey, number | null>;
  onWordsInput: JSX.EventHandler<HTMLTextAreaElement, InputEvent>;
  onAddSuggestedWord: (word: string) => void;
  onIntensityInput: (key: IntensityKey, value: string) => void;
  onTogglePresetTag: (tag: string) => void;
  onCustomTagInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onAddCustomTag: () => void;
  onRemoveTag: (tag: string) => void;
  onSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent>;
}): JSX.Element {
  return (
    <section id="entry-view" class={`view${props.visible ? "" : " hidden"}`}>
      <form id="checkin-form" class="card card-checkin" autocomplete="off" onSubmit={props.onSubmit}>
        <p class="label">{props.title}</p>

        <section class="checkin-section">
          <label for="mood-words" class="label-sm">
            {props.wordsLabel}
          </label>
          <textarea
            id="mood-words"
            name="moodWords"
            rows={3}
            value={props.wordsInputValue}
            placeholder={props.wordsPlaceholder}
            onInput={props.onWordsInput}
          />
          <p class={`word-count${props.showWordLimitHint ? " is-over-limit" : ""}`}>
            {props.wordCountLabel.replace("{count}", String(props.wordCount)).replace("{limit}", String(props.wordLimit))}
          </p>
          {props.showWordLimitHint && <p class="word-limit-hint">{props.softLimitHint}</p>}
        </section>

        <section class="checkin-section suggested-words">
          <p class="label-sm">{props.suggestedWordsLabel}</p>
          <div class="chips">
            {props.suggestedWords.map((word) => (
              <button
                type="button"
                class="chip"
                onClick={() => {
                  props.onAddSuggestedWord(word.value);
                }}
              >
                {word.label}
              </button>
            ))}
          </div>
        </section>

        <section class="checkin-section">
          <div class="intensity-grid">
          {(["energy", "stress", "anxiety", "joy"] as const).map((key) => (
            <label class="intensity-item" for={`intensity-${key}`}>
              <span class="label-sm">{props.intensityLabels[key]}</span>
              <div class="slider-row">
                <input
                  id={`intensity-${key}`}
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={String(props.intensity[key] ?? 0)}
                  onInput={(event) => {
                    props.onIntensityInput(key, event.currentTarget.value);
                  }}
                />
                <output class={`rating-pill${props.intensity[key] === null ? " rating-pill-empty" : ""}`}>
                  {props.intensity[key] === null ? "-/10" : `${props.intensity[key]}/10`}
                </output>
              </div>
            </label>
          ))}
          </div>
        </section>

        <section class="checkin-section context-tags">
          <p class="label-sm">{props.contextTagsLabel}</p>
          <div class="chips">
            {props.presetContextTags.map((tag) => (
              <button
                type="button"
                class={`chip${props.contextTags.includes(tag.value) ? " chip-active" : ""}`}
                onClick={() => {
                  props.onTogglePresetTag(tag.value);
                }}
              >
                {tag.label}
              </button>
            ))}
          </div>
          <div class="custom-tag-row">
            <input
              id="custom-tag-input"
              class="custom-tag-input"
              value={props.customTagValue}
              placeholder={props.customTagPlaceholder}
              onInput={props.onCustomTagInput}
            />
            <button
              type="button"
              class="btn"
              onClick={() => {
                props.onAddCustomTag();
              }}
            >
              {props.addTagLabel}
            </button>
          </div>
          {props.contextTags.length > 0 && (
            <div class="chips selected-tags">
              {props.selectedContextTags.map((tag) => (
                <button
                  type="button"
                  class="chip chip-active"
                  onClick={() => {
                    props.onRemoveTag(tag.value);
                  }}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          )}
        </section>

        <section class="checkin-section checkin-section-submit">
          <button id="save-checkin" class="btn btn-primary" type="submit">
            {props.saveLabel}
          </button>
        </section>
      </form>
    </section>
  );
}
