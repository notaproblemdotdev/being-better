import { Resvg } from "@resvg/resvg-js";
import pngToIco from "png-to-ico";

const BRAND_COLORS = {
  top: "#092849",
  bottom: "#0f4b7b",
  glow: "#1b6da4",
  text: "#dbe8f2",
  shine: "#eaf4ff",
};

function iconSvg(size: number, cornerRadius: number, fontSize: number): string {
  const highlightRadius = Math.round(size * 0.56);
  const highlightCx = Math.round(size * 0.72);
  const highlightCy = Math.round(size * 0.18);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-labelledby="title desc">
  <title id="title">being better icon</title>
  <desc id="desc">Rounded square icon with lowercase bb monogram.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${BRAND_COLORS.top}"/>
      <stop offset="1" stop-color="${BRAND_COLORS.bottom}"/>
    </linearGradient>
    <radialGradient id="shine" cx="0.8" cy="0.15" r="0.9">
      <stop offset="0" stop-color="${BRAND_COLORS.shine}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${BRAND_COLORS.shine}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="url(#bg)"/>
  <circle cx="${highlightCx}" cy="${highlightCy}" r="${highlightRadius}" fill="url(#shine)"/>
  <text
    x="50%"
    y="56%"
    text-anchor="middle"
    dominant-baseline="middle"
    font-family="Avenir Next, Nunito, Trebuchet MS, Segoe UI, sans-serif"
    font-size="${fontSize}"
    font-weight="800"
    letter-spacing="-0.03em"
    fill="${BRAND_COLORS.text}"
  >bb</text>
</svg>
`;
}

async function renderPng(svg: string, outputPath: string): Promise<void> {
  const resvg = new Resvg(svg, { fitTo: { mode: "original" } });
  const pngData = resvg.render().asPng();
  await Bun.write(outputPath, pngData);
}

async function generate(): Promise<void> {
  await Bun.$`mkdir -p public/icons`;

  const svg192 = iconSvg(192, 44, 112);
  const svg512 = iconSvg(512, 116, 292);
  const svg180 = iconSvg(180, 40, 106);
  const svg32 = iconSvg(32, 7, 19);
  const svg16 = iconSvg(16, 4, 10);
  const svg48 = iconSvg(48, 10, 28);

  await Bun.write("public/icons/icon-192.svg", svg192);
  await Bun.write("public/icons/icon-512.svg", svg512);
  await Bun.write("public/icons/apple-touch-icon.svg", svg180);
  await Bun.write("public/favicon.svg", svg32);

  await renderPng(svg192, "public/icons/icon-192.png");
  await renderPng(svg512, "public/icons/icon-512.png");
  await renderPng(svg180, "public/icons/apple-touch-icon.png");
  await renderPng(svg32, "public/favicon-32x32.png");
  await renderPng(svg16, "public/favicon-16x16.png");
  await renderPng(svg48, "public/favicon-48x48.png");

  const ico = await pngToIco(["public/favicon-16x16.png", "public/favicon-32x32.png", "public/favicon-48x48.png"]);
  await Bun.write("public/favicon.ico", ico);
}

await generate();
