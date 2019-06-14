const _shuffle = array => {
  let arr = [...array]

  // loop backwards
  for (let i = arr.length - 1; i > 0; i--) { 

    // pick a random el to swap with current el
    const j = Math.floor(Math.random() * (i + 1)) 

    // swap i, j
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }

  return arr
}

const _isObj = el => {

  // TODO: catch Date, Regex
  if (typeof el !== 'object' || el === null || Array.isArray(el)) return false 
  
  return true
}

const _objEqual = (a, b) => { 
  if (!(_isObj(a) && _isObj(b))) return

  for (let prop in a) {
    if (!(b.hasOwnProperty(prop) && a[prop] == b[prop])) return false
  }
  return true
}

class Cell {
  constructor(value, id) {
    this.value = value
    this.id = id
    
    this.matched = false
  }

  flip() {
    
    if (this.checkMatch()) {
      console.log('match made!')

      this.matched = true
      
      /*
        * reference of previous cell
        * mutates state
      */
      state.previous.matched = true
    }
    
    // mutate state
    state.previous = this
  }

  checkMatch() {
    if (state.previous == undefined) return false
    if (this.value === state.previous.value) return true

    return false
  }
}

const symbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

// state - store reference to previous cell
const state = {
  previous: undefined,
}

// prepare board
const lettersDoubled = [...symbols, ...symbols]
const lettersShuffled = _shuffle(lettersDoubled)
const board = lettersShuffled.map((letter, index) => {
  return new Cell(letter, index)
})

/* DOM */

const clickCell = event => {
  const index = event.target.dataset.id
  const el = event.target
  
  el.classList.add('active')
  setTimeout(_ => {
    el.classList.remove('active')
  }, 500)
  
  board[index].flip()

  if (board[index].matched) {
    el.classList.add('matched')
    el.removeEventListener('click', clickCell)

    const prev = document.querySelector(`div[data-id="${state.previous.id}"]`)
    console.log(prev)
    prev.classList.add('matched')
    prev.removeEventListener('click', clickCell)
  }

  console.log('flipped')
}  

const boardEl = document.getElementById('board')

const cellEls = board.map((cell, index) => {
  let cellEl = document.createElement('div')
  cellEl.innerHTML = `
    <span class="symbol">${cell.value}</span>
  `
  cellEl.className = 'cell'
  cellEl.dataset.id = index
  cellEl.addEventListener('click', clickCell)

  return cellEl
})

const domFrag = document.createDocumentFragment()
cellEls.forEach(cellEl => domFrag.appendChild(cellEl))

boardEl.appendChild(domFrag)