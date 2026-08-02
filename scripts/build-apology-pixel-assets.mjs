import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicRoot = path.join(root, "public", "apology", "assets");
const sourcePath = path.join(publicRoot, "background", "night-garden.webp");
const sceneDir = path.join(publicRoot, "scene");
const choiceDir = path.join(publicRoot, "choices");
const spriteDir = path.join(publicRoot, "sprites");

await Promise.all([sceneDir, choiceDir, spriteDir].map((directory) => fs.mkdir(directory, { recursive: true })));

const clamp = (value, minimum = 0, maximum = 255) => Math.max(minimum, Math.min(maximum, value));
const quantize = (value, step = 4) => Math.round(value / step) * step;

function rgbaCanvas(width, height) {
  return { width, height, data: Buffer.alloc(width * height * 4) };
}

function setPixel(canvas, x, y, color) {
  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
  const offset = (y * canvas.width + x) * 4;
  canvas.data[offset] = color[0];
  canvas.data[offset + 1] = color[1];
  canvas.data[offset + 2] = color[2];
  canvas.data[offset + 3] = color[3] ?? 255;
}

function rect(canvas, x, y, width, height, color) {
  for (let row = y; row < y + height; row += 1) {
    for (let column = x; column < x + width; column += 1) setPixel(canvas, column, row, color);
  }
}

async function saveRaw(canvas, output) {
  await sharp(canvas.data, {
    raw: { width: canvas.width, height: canvas.height, channels: 4 }
  }).webp({ lossless: true, effort: 6 }).toFile(output);
}

async function buildSceneLayers() {
  const { data, info } = await sharp(sourcePath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height;
  const sky = Buffer.alloc(width * height * 3);
  const sampleLeft = Math.floor(width * 0.42);
  const sampleRight = Math.floor(width * 0.58);
  const sampleLimit = Math.floor(height * 0.56);
  const skyRows = [];

  for (let y = 0; y < height; y += 1) {
    const sourceY = Math.min(y, sampleLimit);
    let red = 0;
    let green = 0;
    let blue = 0;
    let count = 0;
    for (let x = sampleLeft; x < sampleRight; x += 4) {
      const offset = (sourceY * width + x) * 3;
      red += data[offset];
      green += data[offset + 1];
      blue += data[offset + 2];
      count += 1;
    }
    const depth = y > sampleLimit ? (y - sampleLimit) / (height - sampleLimit) : 0;
    const row = [
      quantize(clamp(red / count - depth * 10)),
      quantize(clamp(green / count - depth * 7)),
      quantize(clamp(blue / count - depth * 4))
    ];
    skyRows.push(row);
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * 3;
      const dither = ((x >> 2) + (y >> 2)) % 2 === 0 ? 1 : -1;
      sky[offset] = clamp(row[0] + dither);
      sky[offset + 1] = clamp(row[1] + dither);
      sky[offset + 2] = clamp(row[2] + dither);
    }
  }

  await sharp(sky, { raw: { width, height, channels: 3 } })
    .webp({ lossless: true, effort: 6 })
    .toFile(path.join(sceneDir, "sky.webp"));

  const cityTop = Math.floor(height * 0.46);
  const cityBottom = Math.floor(height * 0.84);
  const cityHeight = cityBottom - cityTop;
  await sharp(sourcePath)
    .extract({ left: 0, top: cityTop, width, height: cityHeight })
    .webp({ quality: 88, effort: 6, smartSubsample: true })
    .toFile(path.join(sceneDir, "city.webp"));

  const groundTop = Math.floor(height * 0.79);
  await sharp(sourcePath)
    .extract({ left: 0, top: groundTop, width, height: height - groundTop })
    .webp({ quality: 88, effort: 6, smartSubsample: true })
    .toFile(path.join(sceneDir, "ground.webp"));
}

function buildChoicePanel(kind, frame = 0) {
  const canvas = rgbaCanvas(320, 160);
  const isYes = kind === "yes";
  const outer = isYes ? [86, 45, 62, 255] : [48, 40, 67, 255];
  const edge = isYes ? [165, 83, 46, 255] : [91, 66, 102, 255];
  const fill = isYes ? [47, 27, 59, 255] : [23, 22, 43, 255];
  const inset = isYes ? [87, 39, 57, 255] : [31, 28, 52, 255];

  rect(canvas, 0, 8, 320, 144, [14, 11, 30, 255]);
  rect(canvas, 4, 4, 312, 148, outer);
  rect(canvas, 9, 9, 302, 138, [20, 15, 35, 255]);
  rect(canvas, 14, 14, 292, 128, edge);
  rect(canvas, 20, 20, 280, 116, fill);
  rect(canvas, 24, 24, 272, 108, inset);
  rect(canvas, 28, 28, 264, 100, fill);

  for (let y = 31; y < 126; y += 4) {
    for (let x = 31; x < 290; x += 4) {
      if ((x + y) % 12 === 0) setPixel(canvas, x, y, isYes ? [59, 32, 68, 255] : [28, 27, 50, 255]);
    }
  }

  const bulbPalette = isYes
    ? [[142, 88, 48, 255], [255, 198, 91, 255], [255, 228, 139, 255]]
    : [[82, 66, 94, 255], [191, 155, 110, 255], [225, 199, 151, 255]];
  const positions = [];
  for (let x = 31; x <= 289; x += 13) positions.push([x, 31], [x, 125]);
  for (let y = 44; y <= 112; y += 13) positions.push([31, y], [289, y]);
  positions.forEach(([x, y], index) => {
    const phase = (index + frame) % 4;
    const color = bulbPalette[phase === 0 ? 2 : phase === 1 ? 1 : 0];
    rect(canvas, x - 2, y - 2, 5, 5, color);
    if (phase === 0) setPixel(canvas, x, y, [255, 246, 189, 255]);
  });
  return canvas;
}

function buildBird(frame) {
  const canvas = rgbaCanvas(48, 28);
  const wing = [0, -2, -4, -2, 0, 2][frame];
  const gold = [246, 188, 93, 255];
  const light = [255, 226, 148, 255];
  rect(canvas, 20, 14, 9, 5, gold);
  rect(canvas, 28, 12, 5, 5, light);
  rect(canvas, 33, 14, 3, 2, gold);
  rect(canvas, 16, 13 + wing, 7, 3, gold);
  rect(canvas, 12, 11 + wing, 6, 3, light);
  rect(canvas, 23, 17 - wing, 6, 3, gold);
  return canvas;
}

function buildButterfly(frame) {
  const canvas = rgbaCanvas(36, 28);
  const spread = [2, 4, 6, 5, 3, 1][frame];
  const pink = [238, 145, 194, 255];
  const light = [255, 205, 225, 255];
  rect(canvas, 17, 8, 3, 13, [91, 50, 86, 255]);
  rect(canvas, 17 - spread, 9, spread, 5, pink);
  rect(canvas, 20, 9, spread, 5, pink);
  rect(canvas, 14 - Math.floor(spread / 2), 15, 3 + Math.floor(spread / 2), 4, light);
  rect(canvas, 20, 15, 3 + Math.floor(spread / 2), 4, light);
  return canvas;
}

function buildArrow(frame) {
  const canvas = rgbaCanvas(64, 28);
  const shift = [0, 2, 4, 2][frame];
  const cyan = [87, 235, 216, 255];
  const light = [174, 255, 239, 255];
  rect(canvas, 8 + shift, 12, 34, 5, cyan);
  rect(canvas, 34 + shift, 7, 6, 5, light);
  rect(canvas, 40 + shift, 9, 6, 5, cyan);
  rect(canvas, 40 + shift, 15, 6, 5, cyan);
  rect(canvas, 34 + shift, 18, 6, 5, light);
  rect(canvas, 5 + shift, 11, 5, 7, light);
  return canvas;
}

function buildSparkle(frame) {
  const canvas = rgbaCanvas(28, 28);
  const radius = [2, 4, 6, 4][frame];
  const gold = [255, 217, 117, 255];
  const light = [255, 248, 199, 255];
  rect(canvas, 13, 13 - radius, 3, radius * 2 + 3, gold);
  rect(canvas, 13 - radius, 13, radius * 2 + 3, 3, gold);
  rect(canvas, 14, 14, 2, 2, light);
  return canvas;
}

async function buildSprites() {
  for (let frame = 0; frame < 4; frame += 1) {
    await saveRaw(buildChoicePanel("yes", frame), path.join(choiceDir, `yes-${String(frame + 1).padStart(2, "0")}.webp`));
    await saveRaw(buildArrow(frame), path.join(spriteDir, `arrow-${String(frame + 1).padStart(2, "0")}.webp`));
    await saveRaw(buildSparkle(frame), path.join(spriteDir, `sparkle-${String(frame + 1).padStart(2, "0")}.webp`));
  }
  await saveRaw(buildChoicePanel("no"), path.join(choiceDir, "no.webp"));
  for (let frame = 0; frame < 6; frame += 1) {
    await saveRaw(buildBird(frame), path.join(spriteDir, `bird-${String(frame + 1).padStart(2, "0")}.webp`));
    await saveRaw(buildButterfly(frame), path.join(spriteDir, `butterfly-${String(frame + 1).padStart(2, "0")}.webp`));
  }

  const blendFrames = async (first, second, prefix, phases) => {
    const firstImage = await sharp(path.join(publicRoot, first)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const secondImage = await sharp(path.join(publicRoot, second)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width, height } = firstImage.info;

    for (let frame = 0; frame < phases.length; frame += 1) {
      const amount = phases[frame];
      const output = Buffer.alloc(firstImage.data.length);
      for (let index = 0; index < output.length; index += 1) {
        output[index] = Math.round(firstImage.data[index] * (1 - amount) + secondImage.data[index] * amount);
      }
      await sharp(output, { raw: { width, height, channels: 4 } })
        .webp({ quality: 88, alphaQuality: 100, effort: 6 })
        .toFile(path.join(spriteDir, `${prefix}-${String(frame + 1).padStart(2, "0")}.webp`));
    }
  };

  const driftCloud = async (input, prefix, shifts) => {
    const source = path.join(publicRoot, input);
    for (let frame = 0; frame < shifts.length; frame += 1) {
      await sharp({ create: { width: 336, height: 160, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
        .composite([{ input: source, left: shifts[frame], top: 0 }])
        .webp({ quality: 88, alphaQuality: 100, effort: 6 })
        .toFile(path.join(spriteDir, `${prefix}-${String(frame + 1).padStart(2, "0")}.webp`));
    }
  };

  await Promise.all([
    blendFrames("lamps/lamp-off.webp", "lamps/lamp-on.webp", "lamp", [0, 0.34, 1, 0.58]),
    blendFrames("lamps/bulb-dim.webp", "lamps/bulb-bright.webp", "bulb", [0, 0.42, 1, 0.6]),
    blendFrames("effects/star-dim.webp", "effects/star-bright.webp", "star", [0, 0.48, 1, 0.42]),
    blendFrames("effects/moon-dim.webp", "effects/moon-glow.webp", "moon", [0, 0.38, 1, 0.56]),
    blendFrames("effects/heart-01.webp", "effects/heart-02.webp", "heart", [0, 0.36, 1, 0.62]),
    blendFrames("flowers/flower-01.webp", "flowers/flower-02.webp", "flower", [0, 0.45, 1, 0.55]),
    driftCloud("clouds/cloud-01.webp", "cloud-left", [0, 2, 4, 6, 4, 2]),
    driftCloud("clouds/cloud-02.webp", "cloud-right", [6, 4, 2, 0, 2, 4])
  ]);
}

await Promise.all([buildSceneLayers(), buildSprites()]);
console.log("Apology pixel asset library built.");
