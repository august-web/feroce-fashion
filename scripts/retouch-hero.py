"""
> Note: superseded for the current hero. The home hero now uses real brand
> photography from @ferocefashion_ff (hero-campaign.jpg, 1376x768), a low-key
> interior frame that is already dark enough behind the copy, so
> hero-campaign-tuned.jpg is produced by a straight copy and this script is no
> longer run. It is kept for reference and for re-tuning the original AI
> placeholder if it ever returns.

Retouch the home hero photo so the bright sandstone behind the copy block is
dark enough that the text-block scrim can drop well below 0.8 alpha and still
pass WCAG AA (≥4.5:1).

What it does
  * The text block maps to image region ix≈40-1011, iy≈140-620 across all
    viewport widths (measured from the live layout at 360-1920px) — a feathered
    band over that union.
  * Inside the band, pixels brighter than the target (~L140) are pulled toward
    it; pixels already dark (models' clothing, shadows) are left alone, so the
    figures keep their detail.
  * Output: public/images/hero-campaign-tuned.jpg (used by the main hero only;
    the campaign/"Own the entrance" section keeps the original).

Run:  python scripts/retouch-hero.py
"""
from PIL import Image
import numpy as np

SRC = 'public/images/hero-campaign.jpg'
DST = 'public/images/hero-campaign-tuned.jpg'
TARGET = 140.0     # sandstone gets pulled to roughly this luminance
PULL = 0.9         # how far (0-1) above-target pixels travel toward TARGET

# Text-union band in image coordinates (1376x768), feathered at the edges so the
# retouch reads as a soft tone rather than a hard rectangle. The left feather starts
# at the image edge because the text reaches ix≈40 at wide viewports (1920px).
X0, X1 = 0, 40      # horizontal feather (text starts at ix≈40)
X2, X3 = 1011, 1051
Y0, Y1 = 100, 140   # vertical feather (text rows run iy≈140-620)
Y2, Y3 = 620, 660


def ramp(v, a, b):
    return np.clip((v - a) / (b - a), 0.0, 1.0)


def main() -> None:
    im = Image.open(SRC).convert('RGB')
    rgb = np.asarray(im).astype(np.float32)
    h, w, _ = rgb.shape

    xx = np.arange(w)[None, :]
    yy = np.arange(h)[:, None]
    mask_x = np.minimum(ramp(xx, X0, X1), 1 - ramp(xx, X2, X3))
    mask_y = np.minimum(ramp(yy, Y0, Y1), 1 - ramp(yy, Y2, Y3))
    region = mask_x * mask_y

    lum = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
    excess = np.clip(lum - TARGET, 0, None)          # only darken pixels above target
    factor = 1.0 - (excess / np.maximum(lum, 1e-3)) * PULL * region
    out = np.clip(rgb * factor[..., None], 0, 255).astype(np.uint8)

    Image.fromarray(out).save(DST, quality=88, optimize=True)

    new_lum = 0.2126 * out[..., 0].astype(np.float32) + 0.7152 * out[..., 1].astype(np.float32) + 0.0722 * out[..., 2].astype(np.float32)
    for (ix, iy) in [(830, 344), (800, 470), (450, 300), (250, 200), (750, 420), (620, 500), (1100, 300)]:
        print(f'ix={ix} iy={iy}: {lum[iy, ix]:6.1f} -> {new_lum[iy, ix]:6.1f}')
    print(f'saved {DST} ({w}x{h})')


if __name__ == '__main__':
    main()
