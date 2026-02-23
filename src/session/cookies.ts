export function readCookie(name: string): string | null {
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    const eqIndex = part.indexOf("=");
    if (eqIndex < 0) {
      continue;
    }

    const key = part.slice(0, eqIndex);
    if (key === name) {
      return part.slice(eqIndex + 1);
    }
  }
  return null;
}

export function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  document.cookie = `${name}=${value}; Max-Age=${Math.max(0, Math.floor(maxAgeSeconds))}; Path=/; SameSite=Lax`;
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}
