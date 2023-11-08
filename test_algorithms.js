import { scales, toNaturalNote, getBaseInterval, getNaturalEndNote, calcNaturalSpan, accidentalModifier, getIntervalNote, composeScale } from "../scripts/algorithms.js";

const white = "\x1b[37m";
const red = "\x1b[31m";
const green = "\x1b[32m";

let failCount = 0;
let passCount = 0;

const areArraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
};

const runTestCases = (func, testCases) => {
  console.log(white, `Testing ${func.name}\n`);
  for (const testCase of testCases) {
    const result = func(...testCase.inputs);
    let matched = false;
    if (Array.isArray(result)) {
      areArraysEqual(result, testCase.expected) ? (matched = true) : failCount++;
    } else {
      result === testCase.expected ? (matched = true) : failCount++;
    }
    if (matched) {
        passCount++;
    }
    const colour = matched ? green : red;
    console.log(colour, `Inputs: ${testCase.inputs.join(", ")}, Expected: ${testCase.expected}, Result: ${result}`);
    console.log(colour, `Test passed: ${result}\n`);
  }
};

const test1 = () => {
  const testCases = [
    { inputs: ["C"], expected: "C" },
    { inputs: ["D♯"], expected: "D" },
    { inputs: ["F♯"], expected: "F" },
    { inputs: ["G♯"], expected: "G" },
    { inputs: ["A♯"], expected: "A" },
    { inputs: ["B♭"], expected: "B" },
    { inputs: ["G7"], expected: "G" },
    { inputs: [""], expected: null },
    { inputs: ["K"], expected: null },
  ];

  runTestCases(toNaturalNote, testCases);
};

const test2 = () => {
  const testCases = [
    { inputs: ["m3"], expected: 3 },
    { inputs: ["dim5"], expected: 5 },
    { inputs: ["♭7"], expected: 7 },
    { inputs: ["maj9"], expected: 9 },
    { inputs: ["unison"], expected: 1 },
    { inputs: ["octave"], expected: 8 },
    { inputs: ["aug"], expected: null },
    { inputs: [""], expected: null },
    { inputs: ["notAnInterval"], expected: null },
  ];

  runTestCases(getBaseInterval, testCases);
};

const test3 = () => {
  const testCases = [
    { inputs: ["C", "m2"], expected: "D" },
    { inputs: ["A", "dim4"], expected: "D" },
    { inputs: ["B", "m7"], expected: "A" },
    { inputs: ["G", "aug5"], expected: "D" },
    { inputs: ["D", "m6"], expected: "B" },
  ];

  runTestCases(getNaturalEndNote, testCases);
};

const test4 = () => {
  const testCases = [
    { inputs: ["C", "D"], expected: 2 },
    { inputs: ["A", "D"], expected: 5 },
    { inputs: ["D", "C"], expected: 10 },
    { inputs: ["G", "D"], expected: 7 },
    { inputs: ["D", "B"], expected: 9 },
  ];

  runTestCases(calcNaturalSpan, testCases);
};

const test5 = () => {
  const testCases = [
    { inputs: [1, "C♯"], expected: 0 },
    { inputs: [2, "A"], expected: 2 },
    { inputs: [4, "B♭"], expected: 5 },
    { inputs: [7, "G♯♯"], expected: 5 },
    { inputs: [4, "E♭♭"], expected: 6 },
    { inputs: [6, "F♯♭"], expected: 6 },
  ];

  runTestCases(accidentalModifier, testCases);
};

const test6 = () => {
  const testCases = [
    // Major scale intervals
    { inputs: ["C", "unison"], expected: "C" },
    { inputs: ["C", "octave"], expected: "C" },
    { inputs: ["C", "P1"], expected: "C" },
    { inputs: ["C", "M2"], expected: "D" },
    { inputs: ["C", "M3"], expected: "E" },
    { inputs: ["C", "P4"], expected: "F" },
    { inputs: ["C", "P5"], expected: "G" },
    { inputs: ["C", "M6"], expected: "A" },
    { inputs: ["C", "M7"], expected: "B" },

    // Minor scale intervals
    { inputs: ["A", "m2"], expected: "B♭" },
    { inputs: ["F♯", "m3"], expected: "A" },
    { inputs: ["D", "P4"], expected: "G" },
    { inputs: ["G♯", "m6"], expected: "E" },
    { inputs: ["B♭", "m7"], expected: "A♭" },
    { inputs: ["E♭", "m7"], expected: "D♭" },

    // Augmented and diminished intervals
    { inputs: ["D", "aug5"], expected: "A♯" },
    { inputs: ["C", "aug5"], expected: "G♯" },
    { inputs: ["F♯", "aug4"], expected: "B♯" },
    { inputs: ["G♯", "aug4"], expected: "C♯♯" },
    { inputs: ["C", "dim5"], expected: "G♭" },
    { inputs: ["E", "dim5"], expected: "B♭" },

    // Intervals resulting in dou♭le sharps or flats
    { inputs: ["B", "aug4"], expected: "E♯" }, // Gx is dou♭le sharp
    { inputs: ["F♯", "dim5"], expected: "C" }, // C♭♭ is dou♭le flat
    { inputs: ["C", "aug4"], expected: "F♯" }, // B♭♭ is dou♭le flat
    { inputs: ["G♯", "M2"], expected: "A♯" }, // A♯♯ is dou♭le sharp

    // // Compound intervals
    // { inputs: ["C", "M9"], expected: "D" },
    // { inputs: ["D", "M9"], expected: "E" },
    // { inputs: ["F♯", "m10"], expected: "D" },
    // { inputs: ["B", "M13"], expected: "D" },
    // { inputs: ["A", "m11"], expected: "F" },
  ];
  runTestCases(getIntervalNote, testCases);
};

const test7 = () => {
  const testCases = [
    // Major scale intervals
    { inputs: ["C", scales.major], expected: ["C", "D", "E", "F", "G", "A", "B"] },
    { inputs: ["G", scales.major], expected: ["G", "A", "B", "C", "D", "E", "F♯"] },
    { inputs: ["D", scales.major], expected: ["D", "E", "F♯", "G", "A", "B", "C♯"] },
    { inputs: ["A", scales.major], expected: ["A", "B", "C♯", "D", "E", "F♯", "G♯"] },
    { inputs: ["E", scales.major], expected: ["E", "F♯", "G♯", "A", "B", "C♯", "D♯"] },
    { inputs: ["B", scales.major], expected: ["B", "C♯", "D♯", "E", "F♯", "G♯", "A♯"] },
    { inputs: ["F♯", scales.major], expected: ["F♯", "G♯", "A♯", "B", "C♯", "D♯", "E♯"] },
    { inputs: ["C♯", scales.major], expected: ["C♯", "D♯", "E♯", "F♯", "G♯", "A♯", "B♯"] },
    { inputs: ["F", scales.major], expected: ["F", "G", "A", "B♭", "C", "D", "E"] },
    { inputs: ["B♭", scales.major], expected: ["B♭", "C", "D", "E♭", "F", "G", "A"] },
    { inputs: ["E♭", scales.major], expected: ["E♭", "F", "G", "A♭", "B♭", "C", "D"] },
    { inputs: ["A♭", scales.major], expected: ["A♭", "B♭", "C", "D♭", "E♭", "F", "G"] },
    { inputs: ["D♭", scales.major], expected: ["D♭", "E♭", "F", "G♭", "A♭", "B♭", "C"] },
    { inputs: ["G♭", scales.major], expected: ["G♭", "A♭", "B♭", "C♭", "D♭", "E♭", "F"] },
    { inputs: ["C♭", scales.major], expected: ["C♭", "D♭", "E♭", "F♭", "G♭", "A♭", "B♭"] },

    { inputs: ["A", scales.naturalMinor], expected: ["A", "B", "C", "D", "E", "F", "G"] },
    { inputs: ["E", scales.naturalMinor], expected: ["E", "F♯", "G", "A", "B", "C", "D"] },
    { inputs: ["B", scales.naturalMinor], expected: ["B", "C♯", "D", "E", "F♯", "G", "A"] },
    { inputs: ["F♯", scales.naturalMinor], expected: ["F♯", "G♯", "A", "B", "C♯", "D", "E"] },
    { inputs: ["C♯", scales.naturalMinor], expected: ["C♯", "D♯", "E", "F♯", "G♯", "A", "B"] },
    { inputs: ["G♯", scales.naturalMinor], expected: ["G♯", "A♯", "B", "C♯", "D♯", "E", "F♯"] },
    { inputs: ["D♯", scales.naturalMinor], expected: ["D♯", "E♯", "F♯", "G♯", "A♯", "B", "C♯"] },
    { inputs: ["A♯", scales.naturalMinor], expected: ["A♯", "B♯", "C♯", "D♯", "E♯", "F♯", "G♯"] },
    { inputs: ["D", scales.naturalMinor], expected: ["D", "E", "F", "G", "A", "B♭", "C"] },
    { inputs: ["G", scales.naturalMinor], expected: ["G", "A", "B♭", "C", "D", "E♭", "F"] },
    { inputs: ["C", scales.naturalMinor], expected: ["C", "D", "E♭", "F", "G", "A♭", "B♭"] },
    { inputs: ["F", scales.naturalMinor], expected: ["F", "G", "A♭", "B♭", "C", "D♭", "E♭"] },
    { inputs: ["E♯", scales.naturalMinor], expected: ["E♯", "F♯♯", "G♯", "A♯", "B♯", "C♯", "D♯"] },
    { inputs: ["B♭", scales.naturalMinor], expected: ["B♭", "C", "D♭", "E♭", "F", "G♭", "A♭"] },
    { inputs: ["E♭", scales.naturalMinor], expected: ["E♭", "F", "G♭", "A♭", "B♭", "C♭", "D♭"] },
    { inputs: ["A♭", scales.naturalMinor], expected: ["A♭", "B♭", "C♭", "D♭", "E♭", "F♭", "G♭"] },
  ];
  runTestCases(composeScale, testCases);
};



test1();
test2();
test3();
test4();
test5();
test6();
test7();

console.log(failCount === 0 ? green : red, `Tests passed: ${passCount}, Tests failed: ${failCount}`);
