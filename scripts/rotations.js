import { status, getBubble, updateHeader, allNotesFromOffset, replaceScaleNotes, validTonics } from "./dataStructure.js";
import { fadeElement, populateBubblesByPosition, populateBubblesNoAnimation } from "./helperFunctions.js";
import { composeScale, scales } from "./algorithms.js";

const regexSharpsOrFlats = new RegExp(`[${"♯"}${"♭"}]`, "g");

// rotates the clicked on bubble to the base position.
// Rotates the entire circle structure of arms, connectors and bubbles that match the type of the clicked on bubble
export const rotateLabel = (clickedElem) => {
  const selectedPosition = parseInt(clickedElem.dataset.position);
  if (selectedPosition === 0) {
    return;
  }
  // disable clicking on bubble while animation in progress
  status.respondToClicks = false;

  const homeBubble = getBubble("note", 0);
  const startNoteScale = resolveStartNote(homeBubble.innerText);
  if (!startNoteScale) {
    status.respondToClicks = true;
    return;
  }

  status.currentKey = startNoteScale[0];
  status.chromaticScale = allNotesFromOffset(status.currentKey);

  // set rotation direction as clockwise if postion > 6, otherwise anti-clockwise
  const rotationDirection = selectedPosition > 6 ? "_ccw" : "_cw";
  const counterRotationDirection = rotationDirection === "_cw" ? "_ccw" : "_cw";

  // for each label bubble
  document.querySelectorAll(`.label.bubble`).forEach((bubble) => {
    // get the parent arm of the bubble
    const arm = bubble.parentElement;
    // set the degree of rotation - the current position * 30 degrees
    let rotationDegrees = (gsap.getProperty(arm, "rotation") + selectedPosition * 30) % 360;
    let currentPosition = parseInt(arm.dataset.position);
    const note = document.querySelector(`.note.bubble[data-position="${currentPosition}"]`);
    fadeElement(note);

    gsap.to(arm, { rotation: `${rotationDegrees}${rotationDirection}`, duration: 2 });
    gsap.to(bubble, {
      rotation: `${-rotationDegrees}${counterRotationDirection}`,
      duration: 2,
      onComplete: completeRotation,
    });
  });

  status.chromaticScale = allNotesFromOffset(status.currentKey);
  populateBubblesNoAnimation("note", status.chromaticScale);

  updateHeader();
};

/**
 * @description accepts a compound start note (i.e. contains a '/') and returns an object containing the separate valid tonic start notes, their scales and a count of the accidentals in the scale
 * @param {string} startNote note to start at
 * @returns {string[]} array of one or more valid scales
 */
export const getTonicScales = (startNote) => {
  // set tonics to be an array of starting notes.  This contains either a single valud (if no '/' in passed startNote)
  // or an array containing the separated values (if there is a '/' in the passed startNote)
  let tonics = [startNote];
  if (startNote.includes("/")) {
    tonics = startNote.split("/");
  }

  // get the scales of each of the valid start notes
  const tonicScales = [];
  for (let tonic of tonics) {
    if (!validTonics.has(tonic)) {
      continue;
    }
    tonicScales.push(composeScale(tonic, scales["major"]));
  }
  return tonicScales;
};

/**
 * @description Resolves a potentially ambiguous starting note to an unambiguous note and its scale
 * Eliminates any invalid starting notes (i.e. those that would result in more than 7 sharps or 7 flats)
 * If multiple valid starting notes, selects the one that has fewer accidentals in the key signature
 * @param {string} startNote starting note, e.g. A, F♯/G♭
 * @returns {Array} array containing scale, starting from resolved starting note or null if no valid scales
 */
const resolveStartNote = (startNote) => {
  // gets all valid scales for notes included in startNote
  const scales = getTonicScales(startNote);
  if (scales.length === 1) {
    return scales[0];
  }
  if (scales.length > 1) {
    return selectBestScale(scales);
  }

  return null;
};

/**
 * @decription Selects the scale with the fewest accidentals from the passed array of scales
 * @param {string[][]} scales
 * @return {string[]} the scale with the fewest sharps or flats
 */
const selectBestScale = (scales) => {
  let count = Infinity;
  let index = -1;
  for (let i = 0, l = scales.length; i < l; i++) {
    if (scales[i][0].includes("♯") > 0 && status.keyResolution === "Force ♯") {
      return scales[i];
    }
    if (scales[i][0].includes("♭") > 0 && status.keyResolution === "Force ♭") {
      return scales[i];
    }
    const accidentalsCount = countAccidentals(scales[i]);
    if (accidentalsCount < count) {
      count = accidentalsCount;
      index = i;
    }
  }
  return scales[index];
};

// rotates the clicked on bubble to the zero position.
// Rotates the entire circle structure of arms, connectors and bubbles that match the type of the clicked on bubble
export const rotateNote = (clickedElem) => {
  const selectedPosition = parseInt(clickedElem.dataset.position);
  if (selectedPosition === 0) {
    return;
  }
  // disable clicking on bubble while animation in progress
  status.respondToClicks = false;

  const startNoteScale = resolveStartNote(clickedElem.innerText);
  if (!startNoteScale) {
    status.respondToClicks = true;
    return;
  }

  status.currentKey = startNoteScale[0];
  status.chromaticScale = allNotesFromOffset(status.currentKey);

  // set rotation direction as clockwise if postion > 6, otherwise anti-clockwise
  const rotationDirection = selectedPosition > 6 ? "_cw" : "_ccw";
  const counterRotationDirection = rotationDirection === "_cw" ? "_ccw" : "_cw";

  // for each note bubble
  document.querySelectorAll(`.note.bubble`).forEach((bubble) => {
    // get the parent arm of the bubble
    const arm = bubble.parentElement;
    const connector = arm.querySelector(".connector");
    // set the degree of rotation - the current position * 30 degrees
    let rotationDegrees = (gsap.getProperty(arm, "rotation") - selectedPosition * 30) % 360;
    let currentPosition = parseInt(arm.dataset.position);
    if (currentPosition < selectedPosition) {
      currentPosition += 12;
    }
    arm.dataset.position = currentPosition - selectedPosition;
    bubble.dataset.position = arm.dataset.position;
    connector.dataset.position = arm.dataset.position;
    fadeElement(bubble);

    gsap.to(arm, { rotation: `${rotationDegrees}${rotationDirection}`, duration: 2 });
    gsap.to(connector, { rotation: `${-rotationDegrees}${counterRotationDirection}`, duration: 2 });
    gsap.to(bubble, {
      rotation: `${-rotationDegrees}${counterRotationDirection}`,
      duration: 2,
      onComplete: () => {
        completeRotation();
      },
    });
  });
  const bubble = getBubble("note", 0);
  populateBubblesNoAnimation("note", status.chromaticScale);

  updateHeader();
};

const completeRotation = () => {
  const updatedPositions = replaceScaleNotes(status.currentKey, "major", status.chromaticScale);
  populateBubblesByPosition("note", updatedPositions);
  status.respondToClicks = true;
};

/**
 * @description Counts the number of sharps or flats in a scale
 * @param {string[]} scale
 * @returns {int} count of the number of sharps or flats
 */
const countAccidentals = (scale) => {
  let scaleString = scale.join("");
  const matches = scaleString.match(regexSharpsOrFlats);
  return matches ? matches.length : 0;
};
