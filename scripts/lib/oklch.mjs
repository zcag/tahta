// Minimal sRGB <-> OKLCH, dependency-free. Matches CSS Color 4 oklch().
// Used by the contrast gate to evaluate accent overrides (which the CSS computes
// via `oklch(from ...)`), and by tooling that needs each variant's accent in OKLCH.

const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
const gam = (v) => { v = v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055; return Math.round(Math.max(0, Math.min(1, v)) * 255) }

export function hexToRgb (h) {
  h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join('')
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16))
}
export const rgbToHex = (rgb) => '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('')

// sRGB(0..255) -> OKLab -> OKLCH {l, c, h(deg)}
export function rgbToOklch ([r, g, b]) {
  r = lin(r); g = lin(g); b = lin(b)
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  const C = Math.hypot(a, bb)
  let H = Math.atan2(bb, a) * 180 / Math.PI; if (H < 0) H += 360
  return { l: L, c: C, h: H }
}

// OKLCH -> sRGB(0..255), gamut-clamped per channel (matches browser clip on export)
export function oklchToRgb ({ l: L, c: C, h: H }) {
  const hr = H * Math.PI / 180
  const a = C * Math.cos(hr), b = C * Math.sin(hr)
  const l_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
  const r = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_
  const g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_
  const bch = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_
  return [gam(r), gam(g), gam(bch)]
}

export const hexToOklch = (h) => rgbToOklch(hexToRgb(h))
export const oklchToHex = (o) => rgbToHex(oklchToRgb(o))
