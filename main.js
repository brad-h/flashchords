const createChord = (symbol, notes) => {
  const note = notes.split(" ");
  return {
  "name": note[0] + symbol,
  "notes": notes.split(" ")
  };
};
const major = notes => createChord("M7", notes);
const dominant = notes => createChord("7", notes);
const minor = notes => createChord("m7", notes);
const halfDiminished = notes => createChord("m7b5", notes);
const diminished = notes => createChord("dim", notes);

// there's probably a clever/cute way to derive all this
// information that I'm not going to bother to figure
// out right now, but later... maybe
const data = [
  major("C E G B"),
  dominant("C E G Bb"),
  minor("C Eb G Bb"),
  halfDiminished("C Eb Gb Bb"),
  diminished("C Eb Gb Bbb"),
  major("Db F Ab C"),
  dominant("Db F Ab Cb"),
  minor("C# E G# B"),
  halfDiminished("C# E G B"),
  diminished("C# E G Bb"),
  major("D F# A C#"),
  dominant("D F# A C"),
  minor("D F A C"),
  halfDiminished("D F Ab C"),
  diminished("D F Ab Cb"),
  major("Eb G Bb D"),
  dominant("Eb G Bb Db"),
  minor("Eb Gb Bb Db"),
  halfDiminished("D# F# A C#"),
  diminished("D# F# A C"),
  major("E G# B D#"),
  dominant("E G# B D"),
  minor("E G B D"),
  halfDiminished("E G Bb D"),
  diminished("E G Bb Db"),
  major("F A C E"),
  dominant("F A C Eb"),
  minor("F Ab C Eb"),
  halfDiminished("F Ab Cb Eb"),
  diminished("F Ab Cb Ebb"),
  major("Gb Bb Db F"),
  dominant("Gb Bb Db Fb"),
  minor("F# A C# E"),
  halfDiminished("F# A C E"),
  diminished("F# A C Eb"),
  major("G B D F#"),
  dominant("G B D F"),
  minor("G Bb D F"),
  halfDiminished("G Bb Db F"),
  diminished("G Bb Db Fb"),
  major("Ab C Eb G"),
  dominant("Ab C Eb Gb"),
  minor("Ab Cb Eb Gb"),
  halfDiminished("G# B D F#"),
  diminished("G# B D F"),
  major("A C# E G#"),
  dominant("A C# E G"),
  minor("A C E G"),
  halfDiminished("A C Eb G"),
  diminished("A C Eb Gb"),
  major("Bb D F A"),
  dominant("Bb D F Ab"),
  minor("Bb Db F Ab"),
  halfDiminished("A# C# E G#"),
  diminished("A# C# E G"),
  major("B D# F# A#"),
  dominant("B D# F# A"),
  minor("B D F# A"),
  halfDiminished("B D F A"),
  diminished("B D F Ab")
];

const getInversion = (i, chord) => {
  const inversion = chord.notes.slice(i).concat(chord.notes.slice(0, i));
  switch (i) {
    case 0:
      return {
        "name": chord.name,
        "notes": inversion
      };
    case 1:
      return {
        "name": chord.name + " 1st inversion",
        "notes": inversion
      };
    case 2:
      return {
        "name": chord.name + " 2nd inversion",
        "notes": inversion
      };
    case 3:
      return {
        "name": chord.name + " 3rd inversion",
        "notes": inversion
      };
    default:
      throw "What? How?";
  }
};

const getInversions = chord => {
  const response = [];
  for (let i = 0; i < chord.notes.length; i++) {
    response.push(getInversion(i, chord));
  }
  return response;
};

const flatMap = (xs, f) => {
  var response = [];
  for (let x of xs) {
    for (let y of f(x)) {
      response.push(y);
    }
  }
  return response;
};

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
const shuffle = xs => {
  for (let i  = xs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = xs[i];
    xs[i] = xs[j];
    xs[j] = temp;
  }
};

let deck = [];

const getNext = () => {
  if (deck.length === 0) {
    deck = flatMap(data, getInversions);
    shuffle(deck);
  }
  return deck.pop();
};
let lookup = null;
let mode = null;

const showName = side => {
  document.querySelector(side).innerText = lookup.name;
}

const showNotes = side => {
  document.querySelector(side).innerText = lookup.notes;
};

const nextCard = () => {
  lookup = getNext();
  document.querySelector(".card").classList.remove("flipped");
  const frontBack = [".front", ".back"];
  const [front, back] = mode === "Name" ? frontBack : frontBack.reverse();
  showName(front);
  showNotes(back);
};

const selectMode = element => {
  document.querySelector(".mode").style.display = "none";
  document.querySelector(".app").style.display = "";
  mode = element.innerText;
  nextCard();
};

const flip = () => {
  document.querySelector(".card").classList.toggle("flipped");
};

document.addEventListener('DOMContentLoaded', nextCard);
