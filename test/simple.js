import {as_fuzzy_rx, fuzzy_score, fuzzy_sift_op} from 'fuzzy-rx'
import sift, {createEqualsOperation} from 'sift'
import suite_main from './simple_root.js'


suite_main.test('match test, escapesd', t => {
  let rx = as_fuzzy_rx('hello!')
  let txt = 'I am Happy \n to be here \n totally oblivious!'
  t.assert.ok(true === rx.test(txt))
})

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

suite_main.test('fuzzy sift', t => {
  let sift_opt = {operations: {
    $fuzzy: fuzzy_sift_op(as_fuzzy_rx, createEqualsOperation),
  }}


  let data = [
    { name: "Craig", state: "MN", tags: ["manager", "chef"] },
    { name: "Tim", state: "MN", tags: ["engineer"] },
    { name: "Joe", state: "CA", tags: ["engineer", "manager", "chef"] },
    { name: "Frank", state: "IL", tags: ["manager"] },
    { name: "Don", state: "WA", tags: ["chef"] },
  ]
  let query = {tags: {$fuzzy: 'mgr'}} // manager, the hard way

  let result = data.filter(sift(query, sift_opt))
  t.assert.equal(3, result.length)
})


export default suite_main
