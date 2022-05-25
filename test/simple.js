import {as_fuzzy_rx, fuzzy_score} from 'fuzzy-rx'
import suite_main from './simple_root.js'


suite_main.test('match test, multi-line', t => {
  let rx = as_fuzzy_rx('hello')
  let txt = 'I am Happy \n to be here \n totally oblivious'
  t.assert.ok(true === rx.test(txt))
})

suite_main.test('non-match test', t => {
  let rx = as_fuzzy_rx('hello')
  let txt = 'does not match presented rx example'
  t.assert.ok(false === rx.test(txt))
})

suite_main.test('match obj, multi-line', t => {
  let rx = as_fuzzy_rx('hello')
  let txt = 'I am Happy \n to be here \n totally oblivious'
  let m = rx.exec(txt)
  t.assert.ok(m != null)

  let score = fuzzy_score(m)
  t.assert.ok(1 > score && score > 0, score)
})

suite_main.test('match obj, exact', t => {
  let rx = as_fuzzy_rx('hello')
  let txt = 'See hello there!'
  let m = rx.exec(txt)
  t.assert.ok(m != null)

  let score = fuzzy_score(m)
  t.assert.equal(1, fuzzy_score(m))
})

suite_main.test('match obj, almost exact', t => {
  let rx = as_fuzzy_rx('eello')
  let txt = 'See hello there!'
  let m = rx.exec(txt)
  t.assert.ok(m != null)

  let score = fuzzy_score(m)
  t.assert.ok(1 > score && score > 0, score)
})


export default suite_main
