import {bareuvu, assert} from 'bareuvu'
import basic_rptr from 'bareuvu/esm/rptr/basic.mjs'
import suite_main from './simple.js'

let tid = setTimeout(Boolean, 15000) // keep nodejs open during async

await suite_main.run_main(basic_rptr, {process})

tid = clearTimeout(tid)
