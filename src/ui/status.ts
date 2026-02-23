export function setStatus(statusEl: HTMLParagraphElement, text: string, isError = false): void {
  statusEl.textContent = text;
  statusEl.classList.toggle("status-error", isError);
}
