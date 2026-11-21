# Gait clips — trot, canter, gallop (same horse as the walk loop)

For section 03 (lessons): the horse that walks in place beside the lesson levels gets three
more clips, so each level can show a faster gait. They must look like **one real horse**
filmed in **one studio session** — same horse, same light, same framing as the walk loop.

## Files
- `reference-frame.png` — the horse, side view facing right, on black (1920×1080). Use as
  the **start frame / image reference** for all three clips.
- `walk-style-reference.png` — a frame of the current walk loop: match its framing, scale,
  light and black background.

## Settings (all three clips)
- Image-to-video with `reference-frame.png` as the start frame (or image/character reference)
- 16:9 · 1080p minimum (4K if available) · 8–10 seconds · highest-quality mode
- Generate 3–4 versions of each; keep the one with the cleanest legs and the steadiest rhythm
- **Do not** use an end frame — the horse should keep moving; Claude cuts the seamless loop
  from the clip afterwards (finds two matching strides and joins them)

## Shared description (start of every prompt)
> Photorealistic studio footage of a real dark bay horse with a white blaze, black legs and a
> black mane and tail, wearing a simple dark leather headcollar, no saddle, no rider. Pure
> black background, low-key studio light with a warm rim light along the back, neck and
> legs. Side view, the horse faces and moves to the right. The camera tracks alongside at
> exactly the horse's speed, so the horse stays in the same place in the centre of the frame
> (like moving on an invisible treadmill); the whole horse, from ears to hooves, is always in
> frame, at the same size as the reference image. Locked camera height, no zoom, no cuts.

## 1 · Trot (level 02 — Confidence)
> [shared description] The horse moves in a relaxed, even **working trot**: a clear two-beat
> rhythm where the diagonal pairs of legs move together (left fore with right hind, right
> fore with left hind), a brief moment of suspension between beats, an active swinging back,
> a steady head and neck, ears forward, tail carried softly. Calm, rhythmic and regular for
> the whole clip — the same speed from start to finish. Photorealistic anatomy, every hoof
> lands cleanly on the beat, real hair and muscle movement, sharp focus, natural motion blur
> only at the hooves.

## 2 · Canter (level 03 — Training)
> [shared description] The horse moves in a balanced, rhythmic **working canter on the right
> lead**: a clear three-beat gait (left hind, then the diagonal pair right hind with left
> fore, then the leading right fore), followed by a moment of suspension. A rocking, uphill
> motion through the back and neck, hocks stepping well under, mane lifting and falling with
> each stride, tail flowing. Calm and controlled, the same tempo for the whole clip.
> Photorealistic anatomy, correct canter footfall, real hair and muscle movement, sharp focus.

## 3 · Gallop (level 04 — Competition)
> [shared description] The horse moves in a powerful, extended **gallop**: a four-beat gait
> with a long moment of full suspension where all four legs are off the ground, the body
> stretching long and low, neck and head reaching forward, hind legs driving deep underneath,
> mane and tail streaming back. Fast, athletic and fluid but steady — the same speed for the
> whole clip. Photorealistic anatomy, correct gallop footfall, real hair and muscle movement,
> sharp focus, natural motion blur only on the legs.

## Negative prompt (if the tool has one)
> rider, saddle, bridle bit, extra legs, missing legs, legs merging or bending the wrong way,
> sliding or skating hooves, gait changing mid-clip, stumbling, horse turning or leaving the
> frame, camera shake, zoom, pan, cuts, background, ground texture, dust, other animals,
> morphing, blurry, waxy or smeared texture, CGI, cartoon, text, watermark

## What to check before sending
- Count the legs in slow motion: always four, never merging or bending backwards
- The gait is right: trot = diagonal pairs, canter = 3 beats, gallop = 4 beats + flight
- The horse stays centred and the same size, background pure black, no ground visible
- Same horse as the walk loop (colour, blaze, black legs), same light
- Download the highest-quality MP4 (no re-compression)

## Then
Put the files in `raw/video/` as `trot.mp4`, `canter.mp4` and `gallop.mp4`, or send them in
the chat. Claude will cut seamless loops, encode them for the web and wire them into
section 03 (the brief currently says "walk clip only" — it will be updated when these arrive).
