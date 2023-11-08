import { composeScale, scales } from "./algorithms.js";

export const container = document.querySelector("#container");
export const svgContainer = document.querySelector("svg");
export const header = document.querySelector("#header");

export const allNotes = ["C", "G", "D", "A", "E", "B", "F♯/G♭", "C♯/D♭", "G♯/A♭", "D♯/E♭", "A♯/B♭", "F"];

export const status = {
  baseOffset: -3, // initially locates C to the top of the circle
  homeOffset: 0,
  totalNodes: 0,
  nodesAngle: 0,
  respondToClicks: true,
  contextSubmenuVisible: false,
  scale: "Major",
  labelType: "Chords",
  labels: "min7",
  chordShapeType: "No chord",
  chordShape: "",
  chordRootPosition: 0,
  chromaticScale: allNotes,
  currentKey: "C",
  keyResolution: "Fewest ♯/♭",

  setTotalNodes(notesArray) {
    this.totalNodes = notesArray.length;
    this.nodesAngle = 360 / this.totalNodes;
  },

  getTotalOffsetAngle() {
    return this.baseOffset * this.nodesAngle;
  },

  getPositionAngle(position) {
    return position * this.nodesAngle + this.getTotalOffsetAngle();
  },
};

const intervalPositions = {
  1: 0,
  unison: 0,
  5: 1,
  P5: 1,
  2: 2,
  M2: 2,
  6: 3,
  M6: 3,
  3: 4,
  M3: 4,
  7: 5,
  M7: 5,
  "♭5": 6,
  "♯4": 6,
  tritone: 6,
  4: 11,
  P4: 11,
  m7: 10,
  m3: 9,
  m6: 8,
  m2: 7,
};

export const validTonics = new Set(["A", "B", "C", "D", "E", "F", "G", "F♯", "C♯", "B♭", "E♭", "A♭", "D♭", "G♭", "C♭"]);

// const keys = {
//   major: {
//     C: ["C", "G", "D", "A", "E", "B", "F♯/G♭", "C♯/D♭", "G♯/A♭", "D♯/E♭", "A♯/B♭", "F"],
//     G: ["G", "D", "A", "E", "B", "F♯", "C♯/D♭", "G♯/A♭", "D♯/E♭", "A♯/B♭", "F", "C"],
//   },
// };

const startNoteOffsets = {
  C: 0,
  G: 1,
  D: 2,
  A: 3,
  E: 4,
  B: 5,
  "C♭": 5,
  "F♯/G♭": 6,
  "F♯": 6,
  "G♭": 6,
  "C♯/D♭": 7,
  "C♯": 7,
  "D♭": 7,
  "G♯/A♭": 8,
  "G♯": 8,
  "A♭": 8,
  "D♯/E♭": 9,
  "D♯": 9,
  "E♭": 9,
  "A♯/B♭": 10,
  "A♯": 10,
  "B♭": 10,
  F: 11,
};

export const emptyLabels = ["", "", "", "", "", "", "", "", "", "", "", ""];

const noteLabels = {
  Intervals: {
    Major: {
      "Major 3rd": ["Root", "Perfect\n5th", "Major\n2nd", "Major\n6th", "Major\n3rd", "Major\n7th", "", "", "", "", "", "Perfect\n4th"],
      M3: ["1", "5", "2", "6", "3", "7", "", "", "", "", "", "4"],
      V: ["I", "V", "II", "VI", "III", "VII", "", "", "", "", "", "IV"],
    },
  },
  Chords: {
    Major: {
      iii: ["I", "V", "ii", "vi", "iii", "vii°", "", "", "", "", "", "IV"],
      min7: ["I\nmaj7", "V\n7", "ii\nmin7", "vi\nmin7", "iii\nmin7", "vii°\nmin7♭5", "", "", "", "", "", "IV\nmaj7"],
    },
  },
};

export const chordPatternsInScale = {
  triads: {
    Major: ["maj", "maj", "min", "min", "min", "dim", "", "", "", "", "", "min"],
  },
  tetrads: {
    Major: ["maj7", "7", "min7", "min7", "min7", "m7♭5", "", "", "", "", "", "maj7"],
  },
};

export const chordShapes = {
  triads: {
    maj: ["1", "3", "5"],
    min: ["1", "m3", "5"],
    dim: ["1", "m3", "♭5"],
  },
  tetrads: {
    maj7: ["1", "5", "3", "7"],
    min7: ["1", "5", "m3", "m7"],
    7: ["1", "5", "3", "m7"],
    "m7♭5": ["1", "♭5", "m3", "m7"],
  },
};

const defaultLabels = {
  Intervals: {
    Major: "Major 3rd",
  },
  Chords: {
    Major: "iii",
  },
};

export const updateHeader = () => {
  let headerText = `Key: ${status.currentKey} ${status.scale}`;
  if (status.chordShapeType !== "No chord") {
    const chordRootConnector = getConnector("chordLabel", status.chordRootPosition);
    const chordRoot = getBubbleTextElem("note", chordRootConnector.dataset.position);
    headerText += ` Chord: ${chordRoot.textContent}${status.chordShape}`;
  }
  header.textContent = `${headerText}`;
};

// composes an array of all notes from the allNotes array, starting from an offset
export const allNotesFromOffset = (startNote) => {
  const offset = startNoteOffsets[startNote];
  const positions = [];
  for (let i = 0, l = allNotes.length; i < l; i++) {
    positions.push(allNotes[(i + offset) % l]);
  }
  return positions;
};

/**
 * @description Gets bubble element by class name and position
 * @param {string} className class Name for selector for the bubble, which is added to .bubble and position to select bubble
 * @param {string} position circle position for selecting the bubble
 * @returns {HTMLElement} the bubble element matching the selector
 */
export const getBubble = (className, position) => {
  return document.querySelector(`.${className}.bubble[data-position='${position}']`);
};


export const getBubbleTextElem = (className, position) => {
  return document.querySelector(`.${className}.bubble[data-position='${position}'] .text`);
};

export const getConnector = (className, position) => {
  return document.querySelector(`.${className}-connector[data-position='${position}']`);
};

export const getlabels = () => {
  const labelType = status.labelType;
  const scale = status.scale;
  const labels = status.labels;
  return noteLabels[labelType][scale][labels];
};

export const getscales = () => {
  const labelType = status.labelType;
  const scale = status.scale;
  return noteLabels[labelType][scale];
};

export const getlabelTypes = () => {
  const labelType = status.labelType;
  return noteLabels;
};

export const getDefaultLabels = () => {
  const labelType = status.labelType;
  const scale = status.scale;
  return defaultLabels[labelType][scale];
};

export const intervalToPosition = (interval) => {
  return intervalPositions[interval];
};

export const getchordShapeTypes = () => {
  return chordShapes;
};

export const getDefaultChordType = () => {
  return "triads";
};

// replace scale notes in position array with notes from the scale
// scale type passed is key to scales object (e.g. major)
// scalesPositions passed is array of circle positions starting from tonic note
// update scalePositions in place
// returns an array of positions that were updated
export const replaceScaleNotes = (startNote, scaleType, scalePositions) => {
  const scale = composeScale(startNote, scales[scaleType]);
  const updatedPositions = [];
  for (let i = 0, l = scales[scaleType].length; i < l; i++) {
    const position = intervalToPosition(scales[scaleType][i]);
    if (scalePositions[position] !== scale[i]) {
      updatedPositions.push({ position: position, note: scale[i] });
      scalePositions[position] = scale[i];
    }
  }
  return updatedPositions;
};
