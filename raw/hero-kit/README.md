# Hero head-turn — generation kit

Goal: a **photorealistic** clip of the hero horse slowly turning his head from facing the
camera to a right-facing profile. The site scrubs this clip with scroll, so it must be
smooth, evenly paced and perfectly steady.

## Files
- `first-frame.png` — start frame (horse looking straight at the camera), 1920×1080
- `last-frame.png` — end frame (profile facing right), 1920×1080

## Where to generate
Any top video model that accepts **both a start frame and an end frame** (image-to-video
with first + last frame / "keyframes" / "frames to video"), e.g. Kling, Google Veo, Runway.
Use the highest-quality mode available.

## Settings
- Start frame: `first-frame.png` · End frame: `last-frame.png`
- Aspect ratio 16:9 · Resolution: 1080p minimum (4K if available)
- Duration: 8–10 seconds
- Generate 3–4 versions and keep the one with the most natural, evenly paced turn

## Prompt
> Locked-off studio shot with a completely static camera on a pure black background. A real
> dark bay horse with a white blaze, lit with low-key studio light and a warm rim light on
> the ears, mane and muzzle. The horse slowly and calmly turns its head from looking
> straight into the camera to a side profile facing right, in one smooth, continuous,
> evenly paced movement that lasts the whole clip. Subtle natural life: the ears turn
> slightly, one soft blink, the nostrils flare gently, the mane moves a little with the
> turn. Photorealistic, true-to-life horse anatomy and proportions, fine real hair texture,
> sharp focus on the eye, no motion blur. The background stays pure black.

## Negative prompt (if the tool has one)
> camera movement, zoom, pan, cuts, morphing, warping, distorted anatomy, extra ears, extra
> eyes, blurry, smeared or waxy texture, painterly, CGI, cartoon, flicker, light changes,
> background objects, text, watermark

## What to check before sending
- The camera never moves and the background stays black
- The head turn is smooth from start to finish (no pauses, jumps or speed changes)
- Eye, ears and blaze look real when paused at any moment
- Download the highest-quality MP4 (no re-compression)

## Then
Put the file in `raw/video/` (for example `raw/video/head-turn-v2.mp4`) or send it in the
chat, and run (or ask Claude to run):

    npm run frames -- raw/video/head-turn-v2.mp4

This rebuilds `public/frames/head` and `public/frames/head-mobile` with evenly paced motion.
