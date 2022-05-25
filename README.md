# fuzzy-rx

Fuzzy searching implemented as escaped and compiled regexp.

Inpsired by much prior art, such as Ben Ripkens' [bripkens/fuzzy.js](https://github.com/bripkens/fuzzy.js)


### Install

```bash
> npm install fuzzy-rx
```

### Use

```javascript
import as_fuzzy_rx from 'fuzzy-rx'

let rx_search = as_fuzzy_rx('hello')

let txt_one = 'I am Happy \n to be here \n totally oblivious'
rx_search.test(txt_one) // true
  

let txt_two = 'does not match presented rx_search'
rx_search.test(txt_two) // false
```

