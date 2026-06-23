import { defineMermaidSetup } from '@slidev/types'

// Make Mermaid diagrams variant-aware. Slidev renders Mermaid inside a ShadowRoot,
// so document CSS can't reach the SVG — the supported lever is Mermaid's own
// `themeVariables`. We derive them at render time from the SAME tahta tokens every
// other layout reads (--accent, --fg, --line, --surface-bg…), so a `diagram` slide
// reskins with the deck like everything else, with zero per-diagram config.
//
// Note: Slidev forces `theme: 'dark'` per render (from colorSchema), but
// renderMermaid spreads our setup BEFORE that, and `themeVariables` survive — so the
// explicit colors below fully drive the palette regardless of the base theme.
// Read once (singleton) at first render, against the resolved variant on <html>.
export default defineMermaidSetup(() => {
  if (typeof document === 'undefined') return { theme: 'base' }
  const root = document.documentElement
  const probe = document.createElement('span')
  probe.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;pointer-events:none'
  root.appendChild(probe)
  // Resolve any CSS expression (var()/color-mix/oklch) to a concrete rgb() string —
  // CSS custom props read back as their raw OKLCH source, which Mermaid's color lib
  // (khroma) can't manipulate; the computed `color` is always rgb().
  const col = (expr: string, fallback: string) => {
    probe.style.color = ''
    probe.style.color = expr
    const c = getComputedStyle(probe).color
    return c && c !== 'rgba(0, 0, 0, 0)' ? c : fallback
  }
  const v = (name: string, fallback: string) => col(`var(${name})`, fallback)

  const ink = v('--ink', '#0c0d10')
  const ink2 = v('--ink-2', '#15171c')
  const surface = v('--surface-bg', ink2)
  const fg = v('--fg', '#ece9e3')
  const fgDim = v('--fg-dim', '#9a9b94')
  const line = v('--line', '#262a33')
  const accent = v('--accent', '#7aa2ff')
  const noteBkg = col('color-mix(in oklab, var(--accent) 15%, var(--surface-bg))', surface)
  const activeBkg = col('color-mix(in oklab, var(--accent) 22%, var(--surface-bg))', surface)
  const fontFamily = getComputedStyle(root).getPropertyValue('--font-body').trim() || 'inherit'

  // scheme from --ink luminance, so Mermaid's internal derivations match the variant
  const rgb = (ink.match(/[\d.]+/g) || [12, 13, 16]).map(Number)
  const lum = (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255
  const darkMode = lum < 0.5

  root.removeChild(probe)

  return {
    theme: 'base',
    themeVariables: {
      darkMode,
      fontFamily,
      // shared
      background: ink,
      mainBkg: surface,
      primaryColor: surface,
      primaryBorderColor: accent,
      primaryTextColor: fg,
      secondaryColor: ink2,
      secondaryBorderColor: line,
      secondaryTextColor: fg,
      tertiaryColor: ink2,
      tertiaryBorderColor: line,
      tertiaryTextColor: fg,
      lineColor: fgDim,
      textColor: fg,
      titleColor: fg,
      nodeBorder: accent,
      nodeTextColor: fg,
      edgeLabelBackground: ink,
      clusterBkg: ink2,
      clusterBorder: line,
      defaultLinkColor: fgDim,
      // sequence
      actorBkg: surface,
      actorBorder: accent,
      actorTextColor: fg,
      actorLineColor: line,
      signalColor: fgDim,
      signalTextColor: fg,
      labelBoxBkgColor: surface,
      labelBoxBorderColor: accent,
      labelTextColor: fg,
      loopTextColor: fgDim,
      noteBkgColor: noteBkg,
      noteTextColor: fg,
      noteBorderColor: accent,
      activationBkgColor: activeBkg,
      activationBorderColor: accent,
      sequenceNumberColor: ink,
      // state / class
      classText: fg,
    },
  }
})
