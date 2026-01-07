let segmenter: Intl.Segmenter | null = null

if (typeof Intl === "undefined" || typeof (Intl as any).Segmenter !== "function") {
  await import("@formatjs/intl-segmenter/polyfill-force.js").catch(() => {})
}

export function getGraphemeSegmenter(): Intl.Segmenter {
  if (segmenter) return segmenter

  if (typeof Intl !== "undefined" && typeof (Intl as any).Segmenter === "function") {
    segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" })
    return segmenter
  }

  throw new Error(
    "Intl.Segmenter is not available. Please ensure your runtime supports it or install @formatjs/intl-segmenter",
  )
}

export function isSingleGrapheme(s: string): boolean {
  if (s.length === 0) return false
  if (s.length === 1) return true

  const first = s.charCodeAt(0)
  if (first < 128) {
    const second = s.charCodeAt(1)
    if (second < 128) return false
  }

  const iter = getGraphemeSegmenter().segment(s)[Symbol.iterator]()
  iter.next()
  return iter.next().done === true
}

export function firstGrapheme(str: string): string {
  if (str.length === 0) return ""
  const firstCode = str.charCodeAt(0)
  if (firstCode < 128) {
    if (str.length === 1 || str.charCodeAt(1) < 128) return str[0]!
  }

  const segments = getGraphemeSegmenter().segment(str)
  const first = segments[Symbol.iterator]().next()
  return first.done ? "" : first.value.segment
}
