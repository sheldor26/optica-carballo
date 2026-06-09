/**
 * Crea symlinks bin/ffmpeg y bin/ffprobe apuntando a los binarios estáticos
 * (ffmpeg-static / ffprobe-static) para que HyperFrames los encuentre vía PATH.
 * Corre automáticamente en postinstall. macOS/Linux.
 */
import { mkdirSync, symlinkSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = dirname(fileURLToPath(import.meta.url));
const binDir = join(root, 'bin');

const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;

mkdirSync(binDir, { recursive: true });
for (const [name, target] of [
  ['ffmpeg', ffmpegPath],
  ['ffprobe', ffprobePath],
]) {
  const link = join(binDir, name);
  if (existsSync(link)) rmSync(link);
  symlinkSync(target, link);
  console.log(`bin/${name} -> ${target}`);
}
