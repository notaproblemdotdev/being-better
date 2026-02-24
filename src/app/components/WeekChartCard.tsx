import type { JSX } from "solid-js";
import type { CheckInInsights, CloudWindow, CloudWord, IntensityMetric } from "../logic";

export function WeekChartCard(props: {
  visible: boolean;
  title: string;
  emptyLabel: string;
  summaryTitle: string;
  totalCheckInsLabel: string;
  activeDaysLabel: string;
  streakLabel: string;
  volumeTitle: string;
  noVolumeLabel: string;
  contextTagsTitle: string;
  suggestedWordsTitle: string;
  noTagsLabel: string;
  noSuggestedWordsLabel: string;
  timeframeLabel: string;
  timeframe: CloudWindow;
  words: CloudWord[];
  insights: CheckInInsights;
  intensityLabels: Record<IntensityMetric, string>;
  timeframeOptions: Array<{ value: CloudWindow; label: string }>;
  onTimeframeChange: JSX.EventHandler<HTMLSelectElement, Event>;
}): JSX.Element {
  const maxScore = () => props.words[0]?.score ?? 1;
  const maxVolume = () => Math.max(1, ...props.insights.dailyVolume.map((point) => point.count));
  const maxContextTagCount = () => Math.max(1, ...props.insights.topContextTags.map((entry) => entry.count));
  const maxSuggestedCount = () => Math.max(1, ...props.insights.topSuggestedWords.map((entry) => entry.count));
  const formatAverage = (value: number | null): string => (value === null ? "-/10" : `${value.toFixed(1)}/10`);
  const hasVolume = () => props.insights.dailyVolume.some((point) => point.count > 0);

  return (
    <section id="week-view" class={`view${props.visible ? "" : " hidden"}`}>
      <div class="card">
        <p id="chart-title" class="label">
          {props.title}
        </p>
        <label for="word-cloud-window" class="label-sm">
          {props.timeframeLabel}
        </label>
        <select id="word-cloud-window" class="locale-select" value={props.timeframe} onChange={props.onTimeframeChange}>
          {props.timeframeOptions.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
        {props.words.length === 0 ? (
          <p class="status">{props.emptyLabel}</p>
        ) : (
          <div class="word-cloud" aria-label={props.title}>
            {props.words.map((entry, index) => {
              const ratio = entry.score / maxScore();
              const fontSize = 0.9 + ratio * 1.6;
              const hueRotate = (index * 29) % 80;
              return (
                <span class="cloud-word" style={{ "font-size": `${fontSize}rem`, filter: `hue-rotate(${hueRotate}deg)` }}>
                  {entry.word}
                </span>
              );
            })}
          </div>
        )}

        <div class="analytics-grid">
          <article class="analytics-panel">
            <p class="label-sm analytics-panel-title">{props.summaryTitle}</p>
            <div class="analytics-kpis">
              <p class="analytics-kpi">
                <span>{props.totalCheckInsLabel}</span>
                <strong>{props.insights.totalCheckIns}</strong>
              </p>
              <p class="analytics-kpi">
                <span>{props.activeDaysLabel}</span>
                <strong>{props.insights.activeDays}</strong>
              </p>
              <p class="analytics-kpi">
                <span>{props.streakLabel}</span>
                <strong>{props.insights.currentStreak}</strong>
              </p>
            </div>
            <div class="intensity-summary">
              {props.insights.intensity.map((item) => (
                <div class="intensity-summary-item">
                  <div class="intensity-summary-header">
                    <span>{props.intensityLabels[item.key]}</span>
                    <strong>{formatAverage(item.average)}</strong>
                  </div>
                  <div class="intensity-summary-track">
                    <span
                      class="intensity-summary-fill"
                      style={{ width: `${item.average === null ? 0 : (item.average / 10) * 100}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article class="analytics-panel analytics-panel-volume">
            <p class="label-sm analytics-panel-title">{props.volumeTitle}</p>
            {!hasVolume() ? (
              <p class="status">{props.noVolumeLabel}</p>
            ) : (
              <div class="volume-chart-frame">
                <div class="volume-chart-grid" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div class="volume-chart" aria-label={props.volumeTitle}>
                  {props.insights.dailyVolume.map((point) => (
                    <div class="volume-column">
                      <span class="volume-count">{point.count}</span>
                      <span
                        class="volume-bar"
                        style={{ height: `${Math.max(6, (point.count / maxVolume()) * 100)}%` }}
                        aria-label={`${point.dayLabel}: ${point.count}`}
                      />
                      <span class="volume-label">{point.dayLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        <div class="analytics-grid">
          <article class="analytics-panel">
            <p class="label-sm analytics-panel-title">{props.contextTagsTitle}</p>
            {props.insights.topContextTags.length === 0 ? (
              <p class="status">{props.noTagsLabel}</p>
            ) : (
              <ul class="ranked-list">
                {props.insights.topContextTags.map((entry) => (
                  <li class="ranked-item">
                    <span class="ranked-label">{entry.value}</span>
                    <span class="ranked-meter">
                      <span class="ranked-meter-fill" style={{ width: `${(entry.count / maxContextTagCount()) * 100}%` }} aria-hidden="true" />
                    </span>
                    <strong class="ranked-value">{entry.count}</strong>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article class="analytics-panel">
            <p class="label-sm analytics-panel-title">{props.suggestedWordsTitle}</p>
            {props.insights.topSuggestedWords.length === 0 ? (
              <p class="status">{props.noSuggestedWordsLabel}</p>
            ) : (
              <ul class="ranked-list">
                {props.insights.topSuggestedWords.map((entry) => (
                  <li class="ranked-item">
                    <span class="ranked-label">{entry.value}</span>
                    <span class="ranked-meter">
                      <span class="ranked-meter-fill" style={{ width: `${(entry.count / maxSuggestedCount()) * 100}%` }} aria-hidden="true" />
                    </span>
                    <strong class="ranked-value">{entry.count}</strong>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
