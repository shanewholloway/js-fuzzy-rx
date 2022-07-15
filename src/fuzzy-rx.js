
export const fuzzy_score = rx_match => !rx_match ? 0
  : rx_match[1] ? 1 // perfect match, perfect score
  : Math.pow(.95, rx_match[0].length) // longer matches involve skipping more content


export function fuzzy_rx(flags='si', cache) {
  let _rx_rx_escape = /([-[\]{}()*+!<=:?.\/\\^$|#\s,])/g
  let _xch = (p, idx) =>
      idx & 1 ? ['\\'+p] // escape char present at odd indexes
      : [...p] // isolate individual chars (0+) present at even indexes


  cache = cache || new Map()
  return (sz, fl=flags) => {
    if (!sz) return

    let rx = cache.get(`${sz}\0${fl}`)
    if (!rx) {
      // isolate and escape individual chars
      rx = sz.split(_rx_rx_escape).flatMap(_xch)

      // join to exact match and in-order match
      rx = `(${rx.join('')})|(${rx.join(').*?(')})`

      // set rx into cache
      cache.set(sz, rx = new RegExp(rx, fl))
    }
    return rx
  }
}

export const as_fuzzy_rx = /* #__PURE__ */ fuzzy_rx()
export default as_fuzzy_rx


export function fuzzy_sift_op(as_fuzzy_rx, createEqualsOperation) {
  return (param_search, ownerQuery, options) =>
    createEqualsOperation(
      as_fuzzy_rx(param_search),
      ownerQuery, options)
}

