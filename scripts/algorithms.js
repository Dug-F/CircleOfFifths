// export const naturalNotes = ["C", "D", "E", "F", "G", "A", "B"];
const naturalNotes = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
};

const naturalNotesArray = ["A", "B", "C", "D", "E", "F", "G"];

const naturalNotePositions = {
  A: 0,
  B: 2,
  C: 3,
  D: 5,
  E: 7,
  F: 8,
  G: 10,
};

const intervalDistances = {
  unison: 0,
  1: 0,
  m2: 1,
  M2: 2,
  m3: 3,
  M3: 4,
  dim4: 4,
  P4: 5,
  aug4: 6,
  dim5: 6,
  P5: 7,
  aug5: 8,
  m6: 8,
  M6: 9,
  m7: 10,
  M7: 11,
  octave: 12,
  8: 12
};

const nonNumericIntervals = {
  unison: 1,
  octave: 8,
};

export const scales = {
  major: ["1", "M2", "M3", "P4", "P5", "M6", "M7"],
  naturalMinor: ["1", "M2", "m3", "P4", "P5", "m6", "m7"],
};

// append sharp accidentals to note
export const appendSharps = (note, count) => {
  for (let i = 0; i < count; i++) {
    note += "♯";
  }
  return note;
};

// append flat accidentals to note
export const appendFlats = (note, count) => {
  for (let i = 0; i < count; i++) {
    note += "♭";
  }
  return note;
};

// converts a note potentially containing sharps and flats to a natural note
// input note is a string, containing a note letter and potentially sharps or flats
// returns a string containing the upper case natural note, or null if no note found
export const toNaturalNote = (note) => {
  for (let i = 0, l = note.length; i < l; i++) {
    const noteUpper = note[i].toUpperCase();
    if (naturalNotes.hasOwnProperty(noteUpper)) {
      return noteUpper;
    }
  }
  return null;
};

// gets the base interval from a passed interval, e.g. if the passed interval is m4, returns 4
// input note is a string, containing an interval which must contain a number, potentially with modifiers
// or an entry in the nonNumericIntervals object
// returns a number representing the base interval
export const getBaseInterval = (interval) => {
  if (nonNumericIntervals.hasOwnProperty(interval)) {
    return nonNumericIntervals[interval];
  }
  for (let i = 0, l = interval.length; i < l; i++) {
    if (!isNaN(interval[i])) {
      return Number(interval[i]);
    }
  }
  return null;
};

// returns the natural end note, given a natural start note and interval
export const getNaturalEndNote = (naturalStartNote, interval) => {
  const baseInterval = getBaseInterval(interval);
  const naturalStartPosition = naturalNotes[naturalStartNote];
  const naturalArrayEndIndex = (naturalStartPosition + baseInterval - 1) % 7;
  const naturalEndNote = naturalNotesArray[naturalArrayEndIndex];
  return naturalEndNote;
};

// calculates the interval distance between the natural starting note and natural ending note
export const calcNaturalSpan = (naturalStartNote, naturalEndNote) => {
  // console.log("naturalStartNote: ", naturalStartNote,
  // " naturalEndNote: ", naturalEndNote,
  // " naturalNotePositions[naturalStartNote]", naturalNotePositions[naturalStartNote],
  // " naturalNotePositions[naturalEndNote]: ", naturalNotePositions[naturalEndNote]);

  if (naturalNotePositions[naturalEndNote] < naturalNotePositions[naturalStartNote]) {
    return naturalNotePositions[naturalEndNote] - naturalNotePositions[naturalStartNote] + 12;
  }
  return naturalNotePositions[naturalEndNote] - naturalNotePositions[naturalStartNote];
};

// this function modifies the passed natural span: it increments for every sharp and decrements for every flag
export const accidentalModifier = (naturalSpan, note) => {
  for (let i = 0, l = note.length; i < l; i++) {
    if (note[i] === "♯") {
      naturalSpan--;
    }
    if (note[i] === "♭") {
      naturalSpan++;
    }
  }
  return naturalSpan;
};

export const getIntervalNote = (startNote, interval) => {
  const naturalStartNote = toNaturalNote(startNote);
  const naturalEndNote = getNaturalEndNote(naturalStartNote, interval);
  const naturalSpan = calcNaturalSpan(naturalStartNote, naturalEndNote);
  const modifiedNaturalSpan = accidentalModifier(naturalSpan, startNote);
  const intervalDistance = intervalDistances[interval] % 12;

  //   console.log("naturalStartNote: ", naturalStartNote,
  //   " naturalEndNote: ", naturalEndNote,
  //   " naturalSpan: ", naturalSpan,
  //   " accidentalModifier(naturalSpan, startNote): ", accidentalModifier(naturalSpan, startNote),
  //   " modifiedNaturalSpan: ", modifiedNaturalSpan,
  //   " intervalDistance: ", intervalDistance);

  let endNote = naturalEndNote;
  if (intervalDistance === modifiedNaturalSpan) {
    return endNote;
  }
  if (intervalDistance < modifiedNaturalSpan) {
    return appendFlats(endNote, modifiedNaturalSpan - intervalDistance);
  }
  return appendSharps(endNote, intervalDistance - modifiedNaturalSpan);
};

// composes a scale based on a starting note and a passed scale type, which is a key to the scales object
// the scale interval array is an array containing valid intervals from the intervalDistances object
export const composeScale = (startNote, intervalArray) => {
  const scaleArray = [];
  intervalArray.forEach((interval) => {
    scaleArray.push(getIntervalNote(startNote, interval));
  });
  return scaleArray;
};