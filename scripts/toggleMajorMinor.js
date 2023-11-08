const toggleMajorMinor = () => {
  if (elements.majorMinorSlider.checked) {
    toMinorKey();
  } else {
    toMajorKey();
  }
};

// Swapped to major key
const toMajorKey = () => {
  fadeSlider(minorKey);
  unfadeSlider(majorKey);
  updatePositionNumber(container, ".arm, .bubble", 3);
  status.scale = majIntervals;
  populateBubbles("label2", status.scale);
};

const toMinorKey = () => {
  fadeSlider(majorKey);
  unfadeSlider(minorKey);
  updatePositionNumber(container, ".arm, .bubble", -3);
  status.scale = naturalMinor;
  populateBubbles("label", status.scale);
};

const fadeSlider = (element) => {
  element.classList.add("fade");
  element.classList.remove("unfade");
};

const unfadeSlider = (element) => {
  element.classList.remove("fade");
  element.classList.add("unfade");
};
