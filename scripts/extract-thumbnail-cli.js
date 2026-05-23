#!/usr/bin/env node

/**
 * AetherObjects - Auto Video Thumbnail Generation Utility
 * This script extracts a high-quality frame from the 1st second of an MP4/video file
 * using the system's FFmpeg binary. It can be run from the CLI or imported as a backend service.
 *
 * Requirements:
 * - FFmpeg must be installed on your system.
 *   - macOS: `brew install ffmpeg`
 *   - Ubuntu/Debian: `sudo apt update && sudo apt install -y ffmpeg`
 *   - Windows: `choco install ffmpeg` or download from official site.
 *
 * Usage as CLI:
 *   node scripts/extract-thumbnail-cli.js <path-to-video.mp4> [output-thumbnail-path.jpg]
 *
 * Usage as Module:
 *   const { extractFirstFrame } = require('./scripts/extract-thumbnail-cli');
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

/**
 * Extracts the frame at 1 second from a video file using FFmpeg
 * @param {string} inputVideoPath Absolute or relative path to the source video file
 * @param {string} [outputImagePath] Optional path for the cropped JPEG/PNG. Defaults to "<video-name>-thumbnail.jpg"
 * @returns {Promise<string>} Resolves to the absolute path of the generated thumbnail image
 */
export function extractFirstFrame(inputVideoPath, outputImagePath) {
  return new Promise((resolve, reject) => {
    // 1. Validate inputs
    if (!inputVideoPath) {
      return reject(new Error('Missing input video path. Please provide a path to a valid MP4/video.'));
    }

    const resolvedInput = path.resolve(inputVideoPath);
    if (!fs.existsSync(resolvedInput)) {
      return reject(new Error(`Input video file not found at: ${resolvedInput}`));
    }

    // Default output path: input-name-thumbnail.jpg
    const parsed = path.parse(resolvedInput);
    const resolvedOutput = outputImagePath
      ? path.resolve(outputImagePath)
      : path.join(parsed.dir, `${parsed.name}-thumbnail.jpg`);

    console.log(`\n\x1b[36m[Aether Video Engine]\x1b[0m Commencing automatic thumbnail extraction...`);
    console.log(`\x1b[90mSource Video:\x1b[0m ${resolvedInput}`);
    console.log(`\x1b[90mTarget Frame:\x1b[0m 00:00:01 (First second for maximum product representation)`);

    /**
     * Arguments Explanation:
     * -ss 00:00:01 : Seek to the 1st second quickly before reading input.
     * -i <input>   : Specify input file descriptor.
     * -vframes 1   : Compress and extract exactly 1 frame.
     * -q:v 2       : Set extremely high quality visual scale (range is 1-31, 2 is high-tier).
     * -y           : Overwrite output file if it exists.
     */
    const ffmpegArgs = [
      '-ss', '00:00:01',
      '-i', resolvedInput,
      '-vframes', '1',
      '-q:v', '2',
      resolvedOutput,
      '-y'
    ];

    const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

    let stderrOutput = '';

    ffmpegProcess.stderr.on('data', (data) => {
      stderrOutput += data.toString();
    });

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`\x1b[32m✨ Success!\x1b[0m Automatic thumbnail generated successfully.`);
        console.log(`\x1b[90mOutput Saved to:\x1b[0m ${resolvedOutput}\n`);
        resolve(resolvedOutput);
      } else {
        console.error(`\n\x1b[31m[Aether Video Engine Error]\x1b[0m FFmpeg exited with code ${code}`);
        console.error(`Please verify FFmpeg is installed on your environment.\n`);
        console.error(`\x1b[90mSystem FFmpeg Log Trace:\x1b[0m\n${stderrOutput}`);
        reject(new Error(`FFmpeg failed with exit code ${code}. Log: ${stderrOutput}`));
      }
    });

    ffmpegProcess.on('error', (err) => {
      if (err.code === 'ENOENT') {
        console.error(`\n\x1b[31m[CLI Error]\x1b[0m The 'ffmpeg' command was not found.`);
        console.error(`Please install FFmpeg to use server-side / local media extraction:`);
        console.error(`  - macOS: brew install ffmpeg`);
        console.error(`  - Linux: sudo apt-get install ffmpeg\n`);
      }
      reject(err);
    });
  });
}

// Check if run directly from Command Line
const isDirectCli = process.argv[1] && (
  process.argv[1].endsWith('extract-thumbnail-cli.js') || 
  process.argv[1].endsWith('extract-thumbnail-cli')
);

if (isDirectCli) {
  const args = process.argv.slice(2);
  const inputArg = args[0];
  const outputArg = args[1];

  if (!inputArg) {
    console.log(`
\x1b[35m AetherObjects Automatic Video Frame Extractor CLI\x1b[0m
────────────────────────────────────────────────────
\x1b[1mUsage:\x1b[0m
  node scripts/extract-thumbnail-cli.js <path-to-video.mp4> [output-image-path.jpg]

\x1b[1mExample:\x1b[0m
  node scripts/extract-thumbnail-cli.js assets/intro-promo.mp4 assets/intro-promo-cover.jpg
    `);
    process.exit(1);
  }

  extractFirstFrame(inputArg, outputArg)
    .then((outputPath) => {
      process.exit(0);
    })
    .catch((err) => {
      console.error(`\x1b[31mProcess Failed:\x1b[0m`, err.message);
      process.exit(1);
    });
}
