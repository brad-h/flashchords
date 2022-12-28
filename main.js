const createChord = (symbol, notes) => {
  const note = notes.split(" ")
  return {
  "name": note[0] + symbol,
  "notes": note
  }
}
const createFunction = (key, function_, notes) => {
  const note = notes.split(" ")
  return {
    "name": `${function_} of ${key}`,
    "notes": note
  }
}
const major = (notes) => createChord("M7", notes)
const dominant = (notes) => createChord("7", notes)
const minor = (notes) => createChord("m7", notes)
const halfDiminished = (notes) => createChord("m7b5", notes)
const diminished = notes => createChord("dim", notes)

// there's probably a clever/cute way to derive keys
// from the circle of fifths, but this is fine for now
const keys = [
  "C D E F G A B",
  "Db Eb F Gb Ab Bb C",
  "D E F# G A B C#",
  "Eb F G Ab Bb C D",
  "F G A Bb C D E",
  "Gb Ab Bb Cb Db Eb F",
  "G A B C D E F#",
  "Ab Bb C Db Eb F G",
  "A B C# D E F# G#",
  "Bb C D Eb F G A",
  "B C# D# E F# G# A#"
]
const functions = scale => {
  const scaletones = scale.split(" ")
  const key = scaletones[0]
  const func = (function_, chordtones) =>
    createFunction(key, function_, chordtones.map(x => scaletones[x-1]).join(" "))
  return [
    func("I", [1, 3, 5, 7]),
    func("ii", [2, 4, 6, 1]),
    func("iii", [3, 5, 7, 2]),
    func("IV", [4, 6, 1, 3]),
    func("V", [5, 7, 2, 4]),
    func("vi", [6, 1, 3, 5]),
    func("vii", [7, 2, 4, 6])
  ]
}
const qualities = scale => {
  const scaletones = scale.split(" ")
  const func = (quality, chordtones) =>
    quality(chordtones.map(x => scaletones[x-1]).join(" "))
  return [
    func(major, [1, 3, 5, 7]),
    func(minor, [2, 4, 6, 1]),
    func(dominant, [5, 7, 2, 4]),
    func(halfDiminished, [7, 2, 4, 6])
  ]
}
const data = keys.flatMap(qualities)
  .concat([
  diminished("C Eb Gb Bbb"),
  diminished("C# E G Bb"),
  diminished("D F Ab Cb"),
  diminished("D# F# A C"),
  diminished("E G Bb Db"),
  diminished("F Ab Cb Ebb"),
  diminished("F# A C Eb"),
  diminished("G Bb Db Fb"),
  diminished("G# B D F"),
  diminished("A C Eb Gb"),
  diminished("A# C# E G"),
  diminished("B D F Ab")
])

const getInversion = (i, chord) => {
  const inversion = chord.notes.slice(i).concat(chord.notes.slice(0, i))
  switch (i) {
    case 0:
      return {
        "name": chord.name,
        "notes": inversion
      }
    case 1:
      return {
        "name": chord.name + " 1st inversion",
        "notes": inversion
      }
    case 2:
      return {
        "name": chord.name + " 2nd inversion",
        "notes": inversion
      }
    case 3:
      return {
        "name": chord.name + " 3rd inversion",
        "notes": inversion
      }
    default:
      throw "What? How?"
  }
}

const getInversions = chord => {
  const response = []
  for (let i = 0; i < chord.notes.length; i++) {
    response.push(getInversion(i, chord))
  }
  return response
}

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
const shuffle = xs => {
  for (let i  = xs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = xs[i]
    xs[i] = xs[j]
    xs[j] = temp
  }
}

let deck = []

const getNext = () => {
  if (deck.length === 0) {
    document.querySelector(".mode").style.display = ""
    document.querySelector(".app").style.display = "none"
    return
  }
  return deck.pop()
}

let lookup = null
let mode = null

const showName = side => {
  document.querySelector(side).innerText = lookup.name
}

const showNotes = side => {
  document.querySelector(side).innerText = lookup.notes
}

const nextCard = () => {
  lookup = getNext()
  if (!lookup) return
  document.querySelector(".card").classList.remove("flipped")
  const frontBack = [".front", ".back"]
  const [front, back] = mode === "Spell" ? frontBack : frontBack.reverse()
  showName(front)
  showNotes(back)
}

const selectMode = element => {
  document.querySelector(".mode").style.display = "none"
  document.querySelector(".app").style.display = ""
  mode = element.innerText
  deck = (mode === "Spell" ? data.concat(keys.flatMap(functions)) : data).flatMap(getInversions)
  shuffle(deck)
  nextCard()
}

const flip = () => {
  document.querySelector(".card").classList.toggle("flipped")
}
