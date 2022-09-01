
export const fuzzy_score = rx_match => !rx_match ? 0
  : rx_match[1] ? 1 // perfect match, perfect score
  : Math.pow(.95, rx_match[0].length) // longer matches involve skipping more content


export function fuzzy_rx(opt, cache) {
  if (!opt || opt.substr)
    opt = { flags: opt }

  let _rx_rx_escape = /([-[\]{}()*+!<=:?.\/\\^$|#\s,])/g
  let _xch = (p, idx) =>
      idx & 1 ? ['\\'+p] // escape char present at odd indexes
      : [...p] // isolate individual chars (0+) present at even indexes


  cache = cache || new Map()
  return arg => {
    if ('string' === typeof arg)
      return _rx_for(arg, opt.flags) || (v => true) // simple fuzzy search as a string

    return _adv_search({...opt, ...arg})
  }

  function _rx_for(sz_fuzzy, rx_flags='si') {
    if (! sz_fuzzy) return

    let rx = cache.get(`${sz_fuzzy}\0${rx_flags}`)
    if (!rx) {
      // isolate and escape individual chars
      rx = sz_fuzzy.split(_rx_rx_escape).flatMap(_xch)

      // join to exact match and in-order match
      rx = `(${rx.join('')})|(${rx.join(').*?(')})`

      // set rx into cache
      cache.set(sz_fuzzy, rx = new RegExp(rx, rx_flags))
    }
    return rx
  }

  function _adv_search({prefix, suffix, depth, sep, empty, q, flags}) {
    let rx = _rx_for(q, flags)
    return v => {
      v = v && v.substr ? v : false
      if (v && prefix) {
        v = v.startsWith(prefix) && v.slice(prefix.length)
      }
      if (v && suffix) {
        v = v.endsWith(suffix) && v.slice(0, -suffix.length)
      }
      let _depth  = depth || 1
      if (v && sep) {
        if (v.endsWith(sep)) _depth += 1 // allow ending with a separator

        v = v.split(sep)
        v = v.length > _depth ? false : v.slice(0, _depth).join(sep)
      }

      return v && rx ? rx.test(v) :
        empty ? v !== false : !! v
    }
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

