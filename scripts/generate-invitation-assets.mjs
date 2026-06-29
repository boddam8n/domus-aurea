import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outDir = path.resolve("public/assets/invitation");
await fs.mkdir(outDir, { recursive: true });

async function save(name, svg, width, height) {
  const svgPath = path.join(outDir, `${name}.svg`);
  const webpPath = path.join(outDir, `${name}.webp`);
  await fs.writeFile(svgPath, svg, "utf8");
  await sharp(Buffer.from(svg)).resize(width, height).webp({ quality: 88, effort: 6 }).toFile(webpPath);
}

const noise = Buffer.alloc(256 * 256 * 4);
for (let i = 0; i < noise.length; i += 4) {
  const v = 218 + Math.floor(Math.random() * 28);
  noise[i] = v;
  noise[i + 1] = v - 6;
  noise[i + 2] = v - 14;
  noise[i + 3] = 26 + Math.floor(Math.random() * 18);
}
await sharp(noise, { raw: { width: 256, height: 256, channels: 4 } }).png().toFile(path.join(outDir, "subtle-noise.png"));

const defs = `
  <defs>
    <filter id="paperNoise" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="4" seed="8"/>
      <feColorMatrix type="saturate" values=".18"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 .16"/></feComponentTransfer>
    </filter>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="26" stdDeviation="22" flood-color="#2b130c" flood-opacity=".2"/>
    </filter>
    <linearGradient id="antiqueGold" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#fff0bd"/><stop offset=".18" stop-color="#c79845"/><stop offset=".48" stop-color="#7a4a18"/><stop offset=".72" stop-color="#d8ad5e"/><stop offset="1" stop-color="#fff3c8"/>
    </linearGradient>
    <radialGradient id="waxGold" cx=".42" cy=".35" r=".72">
      <stop stop-color="#ffe7a6"/><stop offset=".32" stop-color="#b98235"/><stop offset=".72" stop-color="#6a3715"/><stop offset="1" stop-color="#2d1308"/>
    </radialGradient>
    <linearGradient id="ivoryPaper" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#fffaf0"/><stop offset=".5" stop-color="#f1e4cc"/><stop offset="1" stop-color="#fff6e5"/>
    </linearGradient>
    <linearGradient id="blackStock" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#090806"/><stop offset=".48" stop-color="#1d1713"/><stop offset="1" stop-color="#050403"/>
    </linearGradient>
    <linearGradient id="burgundy" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#3b070b"/><stop offset=".46" stop-color="#6d1820"/><stop offset="1" stop-color="#2a0508"/>
    </linearGradient>
    <symbol id="cornerVine" viewBox="0 0 220 220">
      <path d="M18 202 C58 143, 78 76, 191 20" fill="none" stroke="url(#antiqueGold)" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M54 154 C83 148, 89 118, 70 101 C53 121, 49 139, 54 154Z" fill="#d8b879" opacity=".62"/>
      <path d="M88 102 C118 101, 127 71, 109 52 C91 70, 85 88, 88 102Z" fill="#e7c990" opacity=".56"/>
      <path d="M129 65 C157 69, 174 43, 160 22 C139 36, 128 50, 129 65Z" fill="#cfa664" opacity=".58"/>
      <circle cx="42" cy="170" r="8" fill="#d8ad5e" opacity=".5"/>
      <circle cx="105" cy="88" r="5" fill="#f2d69a" opacity=".62"/>
      <path d="M24 194 C47 184 58 184 81 195M70 132 C91 122 105 124 126 140M119 72 C141 65 155 67 171 82" fill="none" stroke="#8f5d2b" stroke-width="1.2" opacity=".45"/>
    </symbol>
    <symbol id="tinyFlower" viewBox="0 0 100 100">
      <g fill="#d6a2a2" opacity=".84">
        <ellipse cx="50" cy="27" rx="13" ry="25"/>
        <ellipse cx="50" cy="73" rx="13" ry="25"/>
        <ellipse cx="27" cy="50" rx="25" ry="13"/>
        <ellipse cx="73" cy="50" rx="25" ry="13"/>
        <ellipse cx="33" cy="33" rx="11" ry="22" transform="rotate(-45 33 33)"/>
        <ellipse cx="67" cy="67" rx="11" ry="22" transform="rotate(-45 67 67)"/>
        <ellipse cx="67" cy="33" rx="11" ry="22" transform="rotate(45 67 33)"/>
        <ellipse cx="33" cy="67" rx="11" ry="22" transform="rotate(45 33 67)"/>
      </g>
      <circle cx="50" cy="50" r="9" fill="#c79845"/>
    </symbol>
    <symbol id="arabesqueArch" viewBox="0 0 620 560">
      <path d="M84 508V262C84 170 154 99 242 99h20C274 52 293 28 310 18c17 10 36 34 48 81h20c88 0 158 71 158 163v246" fill="none" stroke="url(#antiqueGold)" stroke-width="6"/>
      <path d="M118 506V272c0-76 58-134 132-134h36c7-42 15-63 24-73 9 10 17 31 24 73h36c74 0 132 58 132 134v234" fill="none" stroke="#8a5b25" stroke-width="2.2" opacity=".42"/>
    </symbol>
  </defs>`;

await save(
  "luxury-background",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="2560" viewBox="0 0 1440 2560">
    ${defs}
    <rect width="1440" height="2560" fill="#efe2cf"/>
    <path d="M-78 446C274 134 672 174 1492 16v2712H-78Z" fill="#d9c0a2" opacity=".55"/>
    <path d="M-180 1710C276 1444 696 1526 1540 1260v1400H-180Z" fill="#f6eadc" opacity=".74"/>
    <path d="M-120 380C278 144 532 542 864 320c246-164 452-216 676-168v-260H-120Z" fill="#fff8ea" opacity=".36"/>
    <path d="M-120 2210C426 1834 740 2188 1560 1780" fill="none" stroke="#8b0710" stroke-width="160" opacity=".08"/>
    <path d="M-80 2200C438 1870 798 2200 1530 1780" fill="none" stroke="#4a080b" stroke-width="72" opacity=".08"/>
    <g opacity=".18">
      <use href="#cornerVine" x="1060" y="80" width="280" height="280"/>
      <use href="#cornerVine" x="80" y="2200" width="260" height="260" transform="rotate(180 210 2330)"/>
    </g>
    <rect width="1440" height="2560" filter="url(#paperNoise)" opacity=".34"/>
    <rect width="1440" height="2560" fill="url(#ivoryPaper)" opacity=".13"/>
  </svg>`,
  1440,
  2560
);

await save(
  "invitation-paper",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1680" viewBox="0 0 1080 1680">
    ${defs}
    <rect x="24" y="24" width="1032" height="1632" rx="34" fill="url(#ivoryPaper)" filter="url(#softShadow)"/>
    <rect x="24" y="24" width="1032" height="1632" rx="34" filter="url(#paperNoise)"/>
    <rect x="58" y="58" width="964" height="1564" rx="24" fill="none" stroke="url(#antiqueGold)" stroke-width="5"/>
    <rect x="76" y="76" width="928" height="1528" rx="18" fill="none" stroke="#7b5122" stroke-width="1.4" opacity=".35"/>
    <use href="#arabesqueArch" x="230" y="130" width="620" height="560" opacity=".92"/>
    <use href="#cornerVine" x="70" y="80" width="230" height="230"/>
    <use href="#cornerVine" x="780" y="80" width="230" height="230" transform="scale(-1 1) translate(-1790 0)"/>
    <use href="#cornerVine" x="70" y="1370" width="250" height="250" transform="scale(1 -1) translate(0 -2990)"/>
    <use href="#cornerVine" x="760" y="1370" width="250" height="250" transform="rotate(180 885 1495)"/>
    <use href="#tinyFlower" x="54" y="1340" width="170" height="170"/>
    <use href="#tinyFlower" x="852" y="1340" width="170" height="170"/>
    <use href="#tinyFlower" x="62" y="96" width="126" height="126"/>
    <use href="#tinyFlower" x="892" y="96" width="126" height="126"/>
    <path d="M332 1512h416" stroke="url(#antiqueGold)" stroke-width="3"/>
    <path d="M478 1535c34-30 88-30 124 0M508 1506c18 24 45 24 64 0" fill="none" stroke="#8f5d2b" stroke-width="2" opacity=".55"/>
  </svg>`,
  1080,
  1680
);

await save(
  "closed-envelope",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1680" viewBox="0 0 1080 1680">
    ${defs}
    <rect width="1080" height="1680" fill="none"/>
    <rect x="90" y="125" width="900" height="1430" rx="30" fill="url(#blackStock)" filter="url(#softShadow)"/>
    <rect x="116" y="150" width="848" height="1378" rx="20" fill="none" stroke="url(#antiqueGold)" stroke-width="4" opacity=".9"/>
    <rect x="137" y="176" width="806" height="1326" rx="16" fill="none" stroke="#f4d898" stroke-width="1.2" opacity=".35"/>
    <path d="M112 1194 540 826l428 368v334H112Z" fill="#0d0b09" stroke="#31251b" stroke-width="2"/>
    <path d="M112 125 540 790 968 125v1068L540 830 112 1193Z" fill="#15110e" opacity=".98"/>
    <path d="M112 125 540 790 968 125" fill="none" stroke="#453224" stroke-width="2.2" opacity=".8"/>
    <path d="M160 280c116 38 190 116 220 236M920 280c-116 38-190 116-220 236" fill="none" stroke="url(#antiqueGold)" stroke-width="2" opacity=".28"/>
    <use href="#cornerVine" x="146" y="170" width="220" height="220" opacity=".26"/>
    <use href="#cornerVine" x="714" y="170" width="220" height="220" transform="scale(-1 1) translate(-1648 0)" opacity=".26"/>
  </svg>`,
  1080,
  1680
);

await save(
  "opened-envelope",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1680" viewBox="0 0 1080 1680">
    ${defs}
    <rect width="1080" height="1680" fill="none"/>
    <rect x="90" y="125" width="900" height="1430" rx="30" fill="#0b0907" opacity=".92" filter="url(#softShadow)"/>
    <path d="M112 125 540 742 968 125v1430H112Z" fill="#0f0c09"/>
    <path d="M112 125 540 742 968 125" fill="none" stroke="url(#antiqueGold)" stroke-width="3" opacity=".45"/>
    <path d="M112 1168 540 820l428 348v360H112Z" fill="#080706"/>
    <path d="M112 1168 540 820l428 348" fill="none" stroke="#6d4b27" stroke-width="2" opacity=".7"/>
    <rect x="146" y="202" width="788" height="1048" rx="22" fill="url(#ivoryPaper)" opacity=".98"/>
    <rect x="172" y="230" width="736" height="990" rx="18" fill="none" stroke="url(#antiqueGold)" stroke-width="3" opacity=".7"/>
  </svg>`,
  1080,
  1680
);

await save(
  "wax-seal-gold",
  `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420">
    ${defs}
    <rect width="420" height="420" fill="none"/>
    <path d="M210 38c27 0 42 22 65 27 24 5 50-7 69 10 20 17 11 46 24 68 12 21 40 33 40 62 0 28-28 42-40 63-13 22-4 51-24 68-19 17-45 5-69 10-23 5-38 27-65 27s-43-22-66-27c-24-5-50 7-69-10-20-17-11-46-24-68-12-21-40-35-40-63 0-29 28-41 40-62 13-22 4-51 24-68 19-17 45-5 69-10 23-5 39-27 66-27Z" fill="url(#waxGold)" filter="url(#softShadow)"/>
    <circle cx="210" cy="210" r="116" fill="none" stroke="#fff0bd" stroke-width="5" opacity=".55"/>
    <circle cx="210" cy="210" r="86" fill="none" stroke="#3e1c0b" stroke-width="3" opacity=".35"/>
    <path d="M164 222c38-82 112-84 142-5M170 244c58 38 112 30 150-24" fill="none" stroke="#ffe6a5" stroke-width="13" stroke-linecap="round" opacity=".86"/>
  </svg>`,
  420,
  420
);

await save(
  "wax-seal-broken",
  `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420">
    ${defs}
    <rect width="420" height="420" fill="none"/>
    <path d="M204 39c-20 2-35 21-57 26-24 5-50-7-69 10-20 17-11 46-24 68-12 21-40 33-40 62 0 28 28 42 40 63 13 22 4 51 24 68 19 17 45 5 69 10 20 4 35 21 56 26l-11-91 26-61-30-46 24-64Z" fill="url(#waxGold)" filter="url(#softShadow)"/>
    <path d="M218 39c20 2 35 21 57 26 24 5 50-7 69 10 20 17 11 46 24 68 12 21 40 33 40 62 0 28-28 42-40 63-13 22-4 51-24 68-19 17-45 5-69 10-20 4-35 21-56 26l12-91-25-61 31-46-23-64Z" fill="url(#waxGold)" filter="url(#softShadow)"/>
    <path d="M210 72v68l-22 48 28 34-24 75 18 51" fill="none" stroke="#2f1308" stroke-width="6" opacity=".55"/>
  </svg>`,
  420,
  420
);

await save(
  "petals",
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1400" viewBox="0 0 900 1400">
    <rect width="900" height="1400" fill="none"/>
    <g fill="#b47d73" opacity=".28">
      <ellipse cx="128" cy="228" rx="22" ry="50" transform="rotate(42 128 228)"/>
      <ellipse cx="720" cy="190" rx="18" ry="44" transform="rotate(-34 720 190)"/>
      <ellipse cx="468" cy="384" rx="15" ry="38" transform="rotate(80 468 384)"/>
      <ellipse cx="204" cy="682" rx="20" ry="48" transform="rotate(-22 204 682)"/>
      <ellipse cx="772" cy="756" rx="24" ry="56" transform="rotate(38 772 756)"/>
      <ellipse cx="434" cy="1090" rx="18" ry="46" transform="rotate(-68 434 1090)"/>
      <ellipse cx="106" cy="1218" rx="16" ry="38" transform="rotate(26 106 1218)"/>
    </g>
    <g fill="#cda05b" opacity=".26">
      <circle cx="98" cy="92" r="5"/><circle cx="818" cy="392" r="4"/><circle cx="522" cy="610" r="3"/><circle cx="296" cy="990" r="4"/><circle cx="846" cy="1210" r="5"/>
    </g>
  </svg>`,
  900,
  1400
);

await fs.writeFile(
  path.join(outDir, "gold-divider.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="32" viewBox="0 0 420 32"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="transparent"/><stop offset=".18" stop-color="#c79845"/><stop offset=".5" stop-color="#fff0bd"/><stop offset=".82" stop-color="#c79845"/><stop offset="1" stop-color="transparent"/></linearGradient></defs><path d="M0 16h174M246 16h174" stroke="url(#g)" stroke-width="2"/><path d="M210 4l12 12-12 12-12-12Z" fill="#c79845"/><circle cx="184" cy="16" r="3" fill="#c79845"/><circle cx="236" cy="16" r="3" fill="#c79845"/></svg>`,
  "utf8"
);

await fs.writeFile(
  path.join(outDir, "arabic-calligraphy-initials.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="220" viewBox="0 0 420 220"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#fff0bd"/><stop offset=".48" stop-color="#c79845"/><stop offset="1" stop-color="#7a4a18"/></linearGradient></defs><path d="M62 148c58-76 124-108 198-94 48 9 80 38 98 77M92 158c84 18 158 3 222-42M134 100c-8 36-2 62 18 78M232 56c14 48 12 92-8 132" fill="none" stroke="url(#g)" stroke-width="11" stroke-linecap="round" opacity=".72"/></svg>`,
  "utf8"
);

await save(
  "burgundy-card-texture",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="520" viewBox="0 0 1200 520">${defs}<rect width="1200" height="520" rx="38" fill="url(#burgundy)"/><rect width="1200" height="520" filter="url(#paperNoise)"/><rect x="34" y="34" width="1132" height="452" rx="26" fill="none" stroke="url(#antiqueGold)" stroke-width="3" opacity=".74"/></svg>`,
  1200,
  520
);

await save(
  "ivory-card-texture",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="520" viewBox="0 0 1200 520">${defs}<rect width="1200" height="520" rx="38" fill="url(#ivoryPaper)"/><rect width="1200" height="520" filter="url(#paperNoise)"/></svg>`,
  1200,
  520
);

await save(
  "bg-soft-ivory",
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1800" viewBox="0 0 900 1800">
    ${defs}
    <rect width="900" height="1800" fill="#fff6ed"/>
    <path d="M-120 320C160 120 330 312 560 156c152-102 272-116 442-58v1820H-120Z" fill="#f2d9cc" opacity=".46"/>
    <path d="M-90 1360C206 1180 398 1316 690 1118c150-102 255-116 340-82v860H-90Z" fill="#f8eadc" opacity=".86"/>
    <path d="M0 0h900v1800H0z" filter="url(#paperNoise)" opacity=".34"/>
    <g opacity=".18">
      <use href="#cornerVine" x="635" y="60" width="220" height="220"/>
      <use href="#cornerVine" x="40" y="1510" width="230" height="230" transform="rotate(180 155 1625)"/>
    </g>
    <circle cx="160" cy="250" r="170" fill="#fffaf3" opacity=".42"/>
    <circle cx="760" cy="1280" r="210" fill="#f0c6bb" opacity=".13"/>
  </svg>`,
  900,
  1800
);

await save(
  "bg-paper-texture",
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1600" viewBox="0 0 900 1600">
    ${defs}
    <rect width="900" height="1600" fill="url(#ivoryPaper)"/>
    <rect width="900" height="1600" filter="url(#paperNoise)" opacity=".7"/>
    <path d="M80 160C210 90 328 134 428 72M716 1430c-120 64-218 48-312 104" fill="none" stroke="#d9b98c" stroke-width="16" opacity=".08"/>
  </svg>`,
  900,
  1600
);

await save(
  "closed-envelope",
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1220" viewBox="0 0 900 1220">
    ${defs}
    <rect width="900" height="1220" fill="none"/>
    <rect x="76" y="196" width="748" height="720" rx="28" fill="#fff5e8" filter="url(#softShadow)"/>
    <rect x="96" y="216" width="708" height="680" rx="22" fill="url(#ivoryPaper)" stroke="url(#antiqueGold)" stroke-width="4"/>
    <rect x="120" y="240" width="660" height="632" rx="18" fill="none" stroke="#8f5d2b" stroke-width="1.4" opacity=".22"/>
    <path d="M96 216 450 585 804 216" fill="#f4e6d0" opacity=".82"/>
    <path d="M96 896 450 576 804 896" fill="#fff3e2" opacity=".88"/>
    <path d="M96 216 450 585 804 216M96 896 450 576 804 896" fill="none" stroke="#bd9860" stroke-width="2.2" opacity=".38"/>
    <path d="M146 284c92 34 144 92 164 176M754 284c-92 34-144 92-164 176" fill="none" stroke="#d3ad70" stroke-width="2" opacity=".24"/>
    <use href="#cornerVine" x="98" y="232" width="170" height="170" opacity=".22"/>
    <use href="#cornerVine" x="632" y="232" width="170" height="170" transform="scale(-1 1) translate(-1434 0)" opacity=".22"/>
    <use href="#tinyFlower" x="112" y="730" width="86" height="86" opacity=".5"/>
    <use href="#tinyFlower" x="702" y="730" width="86" height="86" opacity=".5"/>
  </svg>`,
  900,
  1220
);

await save(
  "opened-envelope",
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1220" viewBox="0 0 900 1220">
    ${defs}
    <rect width="900" height="1220" fill="none"/>
    <rect x="76" y="306" width="748" height="610" rx="28" fill="#fff5e8" filter="url(#softShadow)"/>
    <path d="M96 306 450 96 804 306" fill="#fff8ef" stroke="#bd9860" stroke-width="2.6" opacity=".9"/>
    <path d="M96 916 450 596 804 916" fill="#fff2df" stroke="#bd9860" stroke-width="2" opacity=".9"/>
    <path d="M96 306 450 640 804 306v610H96Z" fill="url(#ivoryPaper)" opacity=".82"/>
    <rect x="118" y="330" width="664" height="562" rx="20" fill="none" stroke="url(#antiqueGold)" stroke-width="3" opacity=".55"/>
  </svg>`,
  900,
  1220
);

await save(
  "envelope-flap",
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500" viewBox="0 0 900 500">${defs}<rect width="900" height="500" fill="none"/><path d="M82 420 450 56 818 420" fill="url(#ivoryPaper)" stroke="url(#antiqueGold)" stroke-width="4" filter="url(#softShadow)"/><path d="M142 390c110-120 196-182 308-206 116 24 202 88 308 206" fill="none" stroke="#bd9860" stroke-width="1.6" opacity=".24"/></svg>`,
  900,
  500
);

await save(
  "envelope-inner",
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="760" viewBox="0 0 900 760">${defs}<rect width="900" height="760" fill="none"/><rect x="82" y="48" width="736" height="650" rx="28" fill="url(#ivoryPaper)" filter="url(#softShadow)"/><path d="M110 92 450 402 790 92M110 664 450 378 790 664" fill="none" stroke="#bd9860" stroke-width="2" opacity=".42"/></svg>`,
  900,
  760
);

await save(
  "wax-seal",
  `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420">
    ${defs}
    <rect width="420" height="420" fill="none"/>
    <path d="M210 38c27 0 42 22 65 27 24 5 50-7 69 10 20 17 11 46 24 68 12 21 40 33 40 62 0 28-28 42-40 63-13 22-4 51-24 68-19 17-45 5-69 10-23 5-38 27-65 27s-43-22-66-27c-24-5-50 7-69-10-20-17-11-46-24-68-12-21-40-35-40-63 0-29 28-41 40-62 13-22 4-51 24-68 19-17 45-5 69-10 23-5 39-27 66-27Z" fill="#c88f82" filter="url(#softShadow)"/>
    <path d="M210 58c24 0 36 20 57 24 22 4 46-7 62 8 18 15 9 42 21 60 11 20 36 30 36 55s-25 38-36 57c-12 20-3 46-21 61-16 15-40 4-62 8-21 4-33 24-57 24s-38-20-59-24c-21-4-45 7-62-8-17-15-8-41-20-61-11-19-36-32-36-57s25-35 36-55c12-18 3-45 20-60 17-15 41-4 62-8 21-4 35-24 59-24Z" fill="none" stroke="#ffe1cf" stroke-width="5" opacity=".55"/>
    <path d="M172 226c42-54 89-56 118-6M180 244c48 26 86 20 116-18" fill="none" stroke="#fff3d6" stroke-width="11" stroke-linecap="round" opacity=".72"/>
  </svg>`,
  420,
  420
);

await save(
  "wax-seal-open",
  `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420">
    ${defs}
    <rect width="420" height="420" fill="none"/>
    <path d="M197 42c-19 4-32 20-52 24-24 5-50-7-69 10-20 17-11 46-24 68-12 21-40 33-40 62 0 28 28 42 40 63 13 22 4 51 24 68 19 17 45 5 69 10 19 4 32 20 52 24l-14-104 25-58-28-49 22-72Z" fill="#c88f82" filter="url(#softShadow)"/>
    <path d="M223 42c19 4 32 20 52 24 24 5 50-7 69 10 20 17 11 46 24 68 12 21 40 33 40 62 0 28-28 42-40 63-13 22-4 51-24 68-19 17-45 5-69 10-19 4-32 20-52 24l14-104-25-58 28-49-22-72Z" fill="#c88f82" filter="url(#softShadow)"/>
    <path d="M210 78v65l-22 44 28 36-24 70 18 50" fill="none" stroke="#7d4d43" stroke-width="6" opacity=".58"/>
  </svg>`,
  420,
  420
);

await save(
  "floral-top-frame",
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="340" viewBox="0 0 900 340">${defs}<rect width="900" height="340" fill="none"/><use href="#cornerVine" x="38" y="36" width="220" height="220"/><use href="#cornerVine" x="642" y="36" width="220" height="220" transform="scale(-1 1) translate(-1504 0)"/><use href="#tinyFlower" x="62" y="58" width="128" height="128"/><use href="#tinyFlower" x="710" y="58" width="128" height="128"/><path d="M230 114C310 58 590 58 670 114" fill="none" stroke="url(#antiqueGold)" stroke-width="3" opacity=".52"/></svg>`,
  900,
  340
);

await save(
  "floral-bottom-frame",
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="420" viewBox="0 0 900 420">${defs}<rect width="900" height="420" fill="none"/><use href="#cornerVine" x="28" y="142" width="260" height="260" transform="scale(1 -1) translate(0 -544)"/><use href="#cornerVine" x="612" y="142" width="260" height="260" transform="rotate(180 742 272)"/><use href="#tinyFlower" x="46" y="214" width="170" height="170"/><use href="#tinyFlower" x="684" y="214" width="170" height="170"/><path d="M210 304C330 350 570 350 690 304" fill="none" stroke="url(#antiqueGold)" stroke-width="3" opacity=".46"/></svg>`,
  900,
  420
);

await save(
  "swans-lake",
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520" viewBox="0 0 900 520">${defs}<rect width="900" height="520" fill="none"/><path d="M80 372c160-42 282-42 370 0 100-44 224-44 370 0v96H80Z" fill="#e7d9c8" opacity=".58"/><path d="M128 388c176 30 314 30 414 0 98-30 180-26 252 12" fill="none" stroke="#a7792d" stroke-width="2" opacity=".28"/><path d="M286 330c38 18 76 18 114 0 38 24 78 32 120 24-44 42-104 58-170 44-48-10-84-32-108-66 10-4 24-4 44-2Z" fill="#fffaf2" stroke="#d4b075" stroke-width="2"/><path d="M330 318c-16-50 20-96 72-92 32 2 52 20 70 48-42-22-80-10-100 36" fill="none" stroke="#fffaf2" stroke-width="28" stroke-linecap="round"/><path d="M520 330c38 18 76 18 114 0 38 24 78 32 120 24-44 42-104 58-170 44-48-10-84-32-108-66 10-4 24-4 44-2Z" fill="#fffaf2" stroke="#d4b075" stroke-width="2"/><path d="M564 318c-16-50 20-96 72-92 32 2 52 20 70 48-42-22-80-10-100 36" fill="none" stroke="#fffaf2" stroke-width="28" stroke-linecap="round"/><use href="#tinyFlower" x="58" y="260" width="128" height="128"/><use href="#tinyFlower" x="718" y="260" width="128" height="128"/></svg>`,
  900,
  520
);

await save(
  "invitation-hero-frame",
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1600" viewBox="0 0 900 1600">${defs}<rect width="900" height="1600" fill="url(#ivoryPaper)"/><rect width="900" height="1600" filter="url(#paperNoise)" opacity=".58"/><rect x="44" y="44" width="812" height="1512" rx="38" fill="none" stroke="url(#antiqueGold)" stroke-width="4" opacity=".72"/><use href="#arabesqueArch" x="140" y="140" width="620" height="560" opacity=".78"/><use href="#cornerVine" x="58" y="68" width="220" height="220"/><use href="#cornerVine" x="622" y="68" width="220" height="220" transform="scale(-1 1) translate(-1464 0)"/><use href="#tinyFlower" x="72" y="112" width="150" height="150"/><use href="#tinyFlower" x="678" y="112" width="150" height="150"/><path d="M104 1248c152 84 540 84 692 0" fill="none" stroke="#c79845" stroke-width="2" opacity=".28"/></svg>`,
  900,
  1600
);

await save(
  "venue-illustration",
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520" viewBox="0 0 900 520">${defs}<rect width="900" height="520" fill="none"/><path d="M170 392h560M218 392V210h464v182M254 210l196-92 196 92M292 392V248M382 392V248M518 392V248M608 392V248" fill="none" stroke="#8a5b25" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".62"/><path d="M450 118v274M214 210h472M250 248h400M286 304h328" fill="none" stroke="#c79845" stroke-width="3" opacity=".46"/><path d="M138 414c170 40 454 40 624 0" fill="none" stroke="#d7a57a" stroke-width="2" opacity=".3"/><use href="#cornerVine" x="52" y="248" width="160" height="160" opacity=".34"/><use href="#cornerVine" x="688" y="248" width="160" height="160" transform="scale(-1 1) translate(-1536 0)" opacity=".34"/></svg>`,
  900,
  520
);

await save(
  "map-frame",
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560" viewBox="0 0 900 560">${defs}<rect x="36" y="34" width="828" height="492" rx="34" fill="#fffaf0" filter="url(#softShadow)"/><rect x="62" y="60" width="776" height="440" rx="24" fill="none" stroke="url(#antiqueGold)" stroke-width="4"/><path d="M124 394C240 302 300 346 406 252c92-82 154-64 238-126M136 168c134 28 222 22 354 118 86 62 148 76 262 48" fill="none" stroke="#d6b882" stroke-width="16" opacity=".24"/><path d="M450 158c54 0 98 42 98 94 0 72-98 156-98 156s-98-84-98-156c0-52 44-94 98-94Z" fill="#c88f82" opacity=".58"/><circle cx="450" cy="252" r="34" fill="#fff8ec" opacity=".9"/><path d="M102 112h696v336H102z" fill="none" stroke="#8a5b25" stroke-width="1.4" opacity=".24"/></svg>`,
  900,
  560
);

await fs.writeFile(
  path.join(outDir, "floral-divider.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="56" viewBox="0 0 520 56"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="transparent"/><stop offset=".18" stop-color="#d7a57a"/><stop offset=".5" stop-color="#a7792d"/><stop offset=".82" stop-color="#d7a57a"/><stop offset="1" stop-color="transparent"/></linearGradient></defs><path d="M0 28h212M308 28h212" stroke="url(#g)" stroke-width="2"/><path d="M260 10c18 14 18 22 0 36-18-14-18-22 0-36Z" fill="#c88f82" opacity=".72"/><path d="M232 30c18-16 38-16 56 0" fill="none" stroke="#a7792d" stroke-width="2" stroke-linecap="round"/></svg>`,
  "utf8"
);

await fs.writeFile(
  path.join(outDir, "ornamental-corners.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#fff0bd"/><stop offset=".5" stop-color="#c79845"/><stop offset="1" stop-color="#7a4a18"/></linearGradient></defs><path d="M70 250C90 130 150 70 270 50M90 190c70-8 106-46 126-116M706 50c120 20 180 80 200 200M790 74c20 70 56 108 126 116M70 650c20 120 80 180 200 200M90 710c70 8 106 46 126 116M706 850c120-20 180-80 200-200M790 826c20-70 56-108 126-116" fill="none" stroke="url(#g)" stroke-width="5" stroke-linecap="round" opacity=".62"/></svg>`,
  "utf8"
);

await fs.copyFile(path.join(outDir, "subtle-noise.png"), path.join(outDir, "paper-noise.png"));

console.log(`Generated assets in ${outDir}`);
