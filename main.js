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
const major = (notes, I, IV) => [
  createChord("M7", notes),
  createFunction(I, "I", notes),
  IV instanceof Array ? createFunction(IV[0], "IV", "IV[1]"): createFunction(IV, "IV", notes)
]
const dominant = (notes, V) => [
  createChord("7", notes),
  createFunction(V, "V", notes)
]
const minor = (notes, ii, iii, vi) => [
  createChord("m7", notes),
  ...Object.entries({
    "ii": ii,
    "iii": iii,
    "vi": vi
  }).map(([function_, key]) =>
    key instanceof Array ? createFunction(key[0], function_, key[1]) : createFunction(key, function_, notes))
]
const halfDiminished = (notes, vii) => [
  createChord("m7b5", notes),
  createFunction(vii, "vii", notes)
]
const diminished = notes => [createChord("dim", notes)]

// there's probably a clever/cute way to derive all this
// information that I'm not going to bother to figure
// out right now, but later... maybe
const data = [
  major("C E G B", "C", "F"),
  dominant("C E G Bb", "F"),
  minor("C Eb G Bb", "Bb", "Ab", "Eb"),
  halfDiminished("C Eb Gb Bb", "Db"),
  diminished("C Eb Gb Bbb"),
  major("Db F Ab C", "Db", "Ab"),
  dominant("Db F Ab Cb", "Gb"),
  minor("C# E G# B", "B", "A", "E"),
  halfDiminished("C# E G B", "D"),
  diminished("C# E G Bb"),
  major("D F# A C#", "D", "A"),
  dominant("D F# A C", "G"),
  minor("D F A C", "C", "Bb", "F"),
  halfDiminished("D F Ab C", "Eb"),
  diminished("D F Ab Cb"),
  major("Eb G Bb D", "Eb", "Bb"),
  dominant("Eb G Bb Db", "Ab"),
  minor("Eb Gb Bb Db", "Db", ["B", "D# F# A# C#"], "Gb"),
  halfDiminished("D# F# A C#", "E"),
  diminished("D# F# A C"),
  major("E G# B D#", "E", "B"),
  dominant("E G# B D", "A"),
  minor("E G B D", "D", "C", "G"),
  halfDiminished("E G Bb D", "F"),
  diminished("E G Bb Db"),
  major("F A C E", "F", "C"),
  dominant("F A C Eb", "Bb"),
  minor("F Ab C Eb", "Eb", "Db", "Ab"),
  halfDiminished("F Ab Cb Eb", "Gb"),
  diminished("F Ab Cb Ebb"),
  major("Gb Bb Db F", "Gb", "Dd"),
  dominant("F# A# C# E", "B"),
  minor("F# A C# E", "E", "D", "A"),
  halfDiminished("F# A C E", "G"),
  diminished("F# A C Eb"),
  major("G B D F#", "G", "D"),
  dominant("G B D F", "C"),
  minor("G Bb D F", "F", "Eb", "Bb"),
  halfDiminished("G Bb Db F", "Ab"),
  diminished("G Bb Db Fb"),
  major("Ab C Eb G", "Ab", "Eb"),
  dominant("Ab C Eb Gb", "Db"),
  minor("Ab Cb Eb Gb", "Gb", ["E", "G# B D# F#"], ["B", "G# B D# F#"]),
  halfDiminished("G# B D F#", "A"),
  diminished("G# B D F"),
  major("A C# E G#", "A", "E"),
  dominant("A C# E G", "D"),
  minor("A C E G", "G", "F", "C"),
  halfDiminished("A C Eb G", "Bb"),
  diminished("A C Eb Gb"),
  major("Bb D F A", "Bb", "F"),
  dominant("Bb D F Ab", "Eb"),
  minor("Bb Db F Ab", "Ab", "Gb", "Db"),
  halfDiminished("A# C# E G#", "B"),
  diminished("A# C# E G"),
  major("B D# F# A#", "B", ["Gb", "Cb Eb Gb Bb"]),
  dominant("B D# F# A", "E"),
  minor("B D F# A", "A", "G", "D"),
  halfDiminished("B D F A", "C"),
  diminished("B D F Ab")
]

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
  deck = (mode === "Spell" ? data.flat() : data.map(x => x[0])).flatMap(getInversions)
  shuffle(deck)
  nextCard()
}

const flip = () => {
  document.querySelector(".card").classList.toggle("flipped")
}
