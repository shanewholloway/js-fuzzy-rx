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

const sift_opt = {operations: {
    $fuzzy: fuzzy_sift_op(as_fuzzy_rx, createEqualsOperation),
}}

const simple_search_data = [
    { name: "Craig", state: "MN", tags: ["manager", "chef"] },
    { name: "Tim", state: "MN", tags: ["engineer"] },
    { name: "Joe", state: "CA", tags: ["engineer", "manager", "chef"] },
    { name: "Frank", state: "IL", tags: ["manager"] },
    { name: "Don", state: "WA", tags: ["chef"] },
]

suite_main.test('fuzzy sift', t => {
  let query = {tags: {$fuzzy: 'mgr'}} // manager, the hard way

  let result = simple_search_data.filter(sift(query, sift_opt))
  t.assert.equal(3, result.length)
})

suite_main.test('fuzzy sift empty string', t => {
  let query = {tags: {$fuzzy: ''}} // manager, the hard way

  let result = simple_search_data.filter(sift(query, sift_opt))
  t.assert.equal(5, result.length)
})

const adv_search_data = [
    { name: "Craig", state: "MN", tags: ["dept_a/manager", "chef"] },
    { name: "Tim", state: "MN", tags: ["dept_a/engineer"] },
    { name: "Joe", state: "CA", tags: ["dept_a/engineer/lead", "dept_b/manager", "chef"] },
    { name: "Frank", state: "IL", tags: ["dept_b/manager"] },
    { name: "Don", state: "WA", tags: ["chef"] },
]

suite_main.test('fuzzy sift with empty object', t => {
  let query = {tags: {$fuzzy: {}}} // manager, the hard way

  let result = adv_search_data.filter(sift(query, sift_opt))
  t.assert.equal(5, result.length)
})

suite_main.test('fuzzy sift with empty q', t => {
  let query = {tags: {$fuzzy: {q: ''}}} // manager, the hard way

  let result = adv_search_data.filter(sift(query, sift_opt))
  t.assert.equal(5, result.length)
})

suite_main.test('fuzzy sift with only prefix', t => {
  let query = {tags: {$fuzzy: {prefix: 'dept_b/'}}} // manager, the hard way

  let result = adv_search_data.filter(sift(query, sift_opt))
  t.assert.equal(2, result.length)
})

suite_main.test('fuzzy sift with q and prefix', t => {
  let query = {tags: {$fuzzy: {q: 'mgr', prefix: 'dept_b/'}}} // manager, the hard way

  let result = adv_search_data.filter(sift(query, sift_opt))
  t.assert.equal(2, result.length)
})

suite_main.test('fuzzy sift with only suffix', t => {
  let query = {tags: {$fuzzy: {suffix: 'lead'}}} // manager, the hard way

  let result = adv_search_data.filter(sift(query, sift_opt))
  t.assert.equal(1, result.length)
})

suite_main.test('fuzzy sift with q and suffix', t => {
  let query = {tags: {$fuzzy: {q: 'eng', suffix: 'lead'}}} // manager, the hard way

  let result = adv_search_data.filter(sift(query, sift_opt))
  t.assert.equal(1, result.length)
})

suite_main.test('fuzzy sift with prefix and suffix', t => {
  let query = {tags: {$fuzzy: {prefix: 'dept_a/', suffix: '/lead'}}}

  let result = adv_search_data.filter(sift(query, sift_opt))
  t.assert.equal(1, result.length)
})

suite_main.test('fuzzy sift with prefix and suffix 2', t => {
  let query = {tags: {$fuzzy: {prefix: 'dept_a/', suffix: 'engineer', empty: true}}}

  let result = adv_search_data.filter(sift(query, sift_opt))
  t.assert.equal(1, result.length)
})

suite_main.test('fuzzy sift with prefix, q, and sep', t => {
  let query = {tags: {$fuzzy: {prefix: 'dept_a/', sep: '/'}}}

  let result = adv_search_data.filter(sift(query, sift_opt))
  t.assert.equal(2, result.length)
})

export default suite_main
