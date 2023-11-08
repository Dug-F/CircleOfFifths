import { getlabels, status } from "./dataStructure.js";

export const fadeElement = (element) => {
  element.classList.remove("fade");
  // if (element.dataset.position < 11 && element.dataset.position > 5) {
  if (!getlabels()[element.dataset.position]) {
    element.classList.add("fade");
  }
};

// updates the position number for all elements matching passed selector
// the position number is updated by the amount passed in offset
export const updatePositionNumber = (parent, selector, offset) => {
  parent.querySelectorAll(selector).forEach((element) => {
    let newPosition = Number(element.dataset.position) + offset;
    element.dataset.position = newPosition < 0 ? newPosition + 12 : newPosition % 12;
  });
};

export const updateHomeOffset = (offset) => {
  status.homeOffset = (status.homeOffset + offset) % 12;
}

export function getElementCenter(element) {
  const rect = element.getBoundingClientRect();

  const width = rect.width;
  const height = rect.height;

  const centerX = rect.left + width / 2;
  const centerY = rect.top + height / 2;

  return { x: centerX, y: centerY };
}

export const getElementRect = (element) => {
  if (!element.classList.contains("hidden")) {
    return element.getBoundingClientRect();
  }
  element.classList.remove("hidden");
  const rect = element.getBoundingClientRect();
  element.classList.add("hidden");
  return rect;
};

// update text contents of bubble selected by passed classname.
// new contents are passed in contentsArray, indexed by the dataset-position of the bubble
// performs a transition animation
export const populateBubbles = (className, contentsArray) => {
  const bubbles = document.querySelectorAll(`.bubble.${className} .text`);
  bubbles.forEach((bubble) => {
    gsap.effects.swapText(bubble, { text: contentsArray[parseInt(bubble.parentElement.dataset.position)] });
  });
};

// update text contents of bubble selected by passed classname.
// new contents are passed in contentsArray, indexed by the dataset-position of the bubble
// performs no transition animation
export const populateBubblesNoAnimation = (className, contentsArray) => {
  const bubbles = document.querySelectorAll(`.bubble.${className} .text`);
  bubbles.forEach((bubble) => {
    bubble.textContent = contentsArray[parseInt(bubble.parentElement.dataset.position)];
  });
};

// update text contents of bubble selected by passed classname.
// new contents are passed in contentsArray, which is an array of objects containing position and new text
// performs a transition animation
export const populateBubblesByPosition = (className, contentsArray) => {
  for (const contents of contentsArray) {
    const bubble = document.querySelector(`.${className}.bubble[data-position='${contents.position}'] .text`);
    gsap.effects.swapText(bubble, { text: contents.note });
  }
};

// export const populatePositionBubble = (className, ) => {

// }
