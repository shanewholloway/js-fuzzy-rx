
export const fuzzy_score = rx_match => !rx_match ? 0
  : rx_match[1] ? 1 // perfect match, perfect score
  : Math.pow(.95, rx_match[0].length) // longer matches involve skipping more content

export function fuzzy_rx(flags='si', cache) {
  let _rx_rx_escape = /[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g
  cache = cache || new Map()

  return (sz, fl=flags) => {
    if (!sz) return

    let rx = cache.get(`${sz}\0${fl}`)
    if (!rx) {
      let rx_sz = sz.replace(_rx_rx_escape, '\\$&')
      rx = [... rx_sz]
      rx = `(${rx_sz})|(${rx.join(').*?(')})`
      rx = new RegExp(rx, fl)
      cache.set(sz, rx)
    }
    return rx
  }
}

export const as_fuzzy_rx = /* #__PURE__ */ fuzzy_rx()
export default as_fuzzy_rx

