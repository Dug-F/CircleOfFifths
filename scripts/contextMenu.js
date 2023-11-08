import { status, getlabelTypes, getDefaultLabels, getlabels, getscales, getchordShapeTypes, getDefaultChordType } from "./dataStructure.js";
import { updatePositionNumber, updateHomeOffset, populateBubbles, getElementRect } from "./helperFunctions.js";
import { rotateLabel, rotateNote } from "./rotations.js";
import { drawChords } from "./drawChords.js";

const contextMenu = document.querySelector("#contextMenu");
const contextSubmenu = document.querySelector("#contextSubmenu");
const tickSymbol = String.fromCharCode(0x2713);

export const submenus = new Set(["Key resolution", "Label type", "Labels", "Chord type"]);

//****************
//* context menu *
//****************

// positions and shows the context menu
const showContextMenu = (event) => {
  contextMenu.style.top = `${event.clientY - container.getBoundingClientRect().top - 10}px`;
  contextMenu.style.left = `${event.x + 10}px`;
  contextMenu.classList.remove("hidden");
};

// removes descendant line item elements
const removeLineItems = (event, parent) => {
  parent.querySelectorAll("li").forEach((element) => {
    element.remove();
  });
};

// handles initial right click and builds context menu
export const handleContextClick = (event) => {
  event.preventDefault();
  showContextMenu(event);

  // remove any existing line items - this also discards their event listeners
  removeLineItems(event, contextMenu);

  // add new line items
  // to add a new line item:
  // 1. add a createContextMenuItem line
  // 2. create an entry in the contextCallbacks constant to define which callback to invoke
  // 3. create the callback function referred to in 2
  // 4. if the line item is for a sub-menu, add it to the submenus array constant

  const parent = contextMenu.querySelector("ul");
  createContextMenuItem("Make tonic", parent, event);
  createContextMenuItem("Clock", parent, event);
  createContextMenuItem("Label type", parent, event, "", ">");
  createContextMenuItem("Labels", parent, event, "", ">");
  createContextMenuItem("Chord type", parent, event, "", ">");
  createContextMenuItem("Show chord", parent, event);
  createContextMenuItem("Key resolution", parent, event, "", ">");
};

//*******************
//* context submenu *
//*******************

// hide the context submenu
export const hideContextSubmenu = () => {
  contextSubmenu.classList.add("hidden");
  status.contextSubmenuVisible = false;
};

// show the context submenu
export const showContextSubmenu = () => {
  contextSubmenu.classList.remove("hidden");
  status.contextSubmenuVisible = true;
};

// set the position of the context submenu
const setContextSubmenuPosition = (event) => {
  const submenuRect = getElementRect(contextSubmenu);
  const menuRect = contextMenu.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const clickedRect = event.target.parentElement.getBoundingClientRect();

  if (containerRect.x + containerRect.width < menuRect.x + menuRect.width + submenuRect.width) {
    contextSubmenu.style.left = `${menuRect.x - menuRect.width + 5}px`;
  } else {
    contextSubmenu.style.left = `${menuRect.x + menuRect.width + 5}px`;
  }

  contextSubmenu.style.top = `${event.clientY - 10}px`;
};

//**************
//* menu items *
//**************

// builds the individual components of a menu line item
const createContextMenuComponent = (parent, className, textContent = "") => {
  const component = document.createElement("span");
  component.classList.add(className);
  component.textContent = textContent;
  parent.appendChild(component);
};

// builds a new context menu or submenu line item
const createContextMenuItem = (itemText, parent, event, shortcut = "", suffix = "") => {
  // create menu item li container
  const item = document.createElement("li");

  createContextMenuComponent(item, "context-text", itemText);
  // createContextMenuComponent(item, "context-shortcut", shortcut);
  createContextMenuComponent(item, "context-suffix", suffix);

  if (contextCallbacks[itemText]) {
    item.addEventListener("click", contextCallbacks[itemText]);
  }

  item.setAttribute("data-position", event.target.dataset.position);
  parent.appendChild(item);

  // return line item
  return item;
};

//**********************
//* callback functions *
//**********************
//
// the callback functions are set in the contextCallbacks constant

// builds the label types sub-menu line item

// make the selected bubble the new position 0 for the scale
const callbackMakeTonic = (event) => {
  const position = event.target.dataset.position;
  const clickedElement = document.querySelector(`.label.bubble[data-position="${position}"]`);
  updatePositionNumber(container, ".note-arm, .bubble.note, .connector", -Number(position));
  updateHomeOffset(Number(position));
  status.chordShapeType = "No chord";
  drawChords(position);
  rotateLabel(clickedElement);
  console.log(status);
};

// show the chromatic scale as a clock face
const callbackClock = (event) => {
  // console.log(status);
  const homeBubble = document.querySelector(`.note.bubble[data-home="home"]`);
  const homePosition = homeBubble.dataset.position;
  console.log("rotation: ", homeBubble.style.transform);
  console.log(status);
  const homeLabel = document.querySelector(`.label.bubble[data-position="${homePosition}"]`);
  updatePositionNumber(container, ".note-arm, .bubble.note, .connector", -Number(homePosition));
  // // status.chordShapeType = "No chord";
  // // drawChords(position);
  rotateNote(homeBubble);
  rotateLabel(homeLabel);
};

// builds the label types sub-menu line item
const callbackLabelType = (event) => {
  event.preventDefault();

  removeLineItems(event, contextSubmenu);

  if (status.contextSubmenuVisible) {
    return;
  }
  const parent = contextSubmenu.querySelector("ul");
  // status.scale = "Major";
  for (let key in getlabelTypes()) {
    // const menuItem = createContextMenuItem(key, parent, event);
    const tick = key === status.labelType ? tickSymbol : "";
    const menuItem = createContextMenuItem(key, parent, event, "", tick);
    menuItem.classList.add("submenu");
    menuItem.setAttribute("data-position", event.target.dataset.position);
    menuItem.addEventListener("click", changeLabelType);
  }
  setContextSubmenuPosition(event);
};

// builds the chord types sub-menu line item
const callbackChordType = (event) => {
  event.preventDefault();

  removeLineItems(event, contextSubmenu);

  if (status.contextSubmenuVisible) {
    return;
  }
  const parent = contextSubmenu.querySelector("ul");

  // add the 'No chords' menu option
  const tick = status.chordShapeType === "No chord" ? tickSymbol : "";
  const menuItem = createContextMenuItem("No chord", parent, event, "", tick);
  menuItem.addEventListener("click", changeChordShapeType);

  // status.scale = "Major";
  for (let key in getchordShapeTypes()) {
    // const menuItem = createContextMenuItem(key, parent, event);
    const tick = key === status.chordShapeType ? tickSymbol : "";
    const menuItem = createContextMenuItem(key, parent, event, "", tick);
    menuItem.classList.add("submenu");
    menuItem.setAttribute("data-position", event.target.dataset.position);
    menuItem.addEventListener("click", changeChordShapeType);
  }
  setContextSubmenuPosition(event);
};

// builds the chord shapes sub-menu line item
const callbackChords = (event) => {
  event.preventDefault();

  if (status.contextSubmenuVisible) {
    return;
  }

  const position = event.target.dataset.position;
  if (status.chordShapeType === "No chord") {
    status.chordShapeType = getDefaultChordType();
    status.labels = getDefaultLabels();
    status.chordShape = "";
  }
  status.chordRootPosition = position;
  drawChords(position);
};

// change how ambiguous keys are resolved when bubble clicked or tonic changed
const callbackKeyResolution = (event) => {
  event.preventDefault();

  removeLineItems(event, contextSubmenu);

  if (status.contextSubmenuVisible) {
    return;
  }
  const parent = contextSubmenu.querySelector("ul");
  for (let key of ["Fewest ♯/♭", "Force ♯", "Force ♭"]) {
    const tick = key === status.keyResolution ? tickSymbol : "";
    const menuItem = createContextMenuItem(key, parent, event, "", tick);
    menuItem.classList.add("submenu");
    menuItem.addEventListener("click", changeKeyResolution);
  }
  setContextSubmenuPosition(event);
};

// builds the intervals sub-menu line item
const callbackLabels = (event) => {
  event.preventDefault();

  removeLineItems(event, contextSubmenu);

  if (status.contextSubmenuVisible) {
    return;
  }
  const parent = contextSubmenu.querySelector("ul");
  // status.scale = "Major";
  for (let key in getscales()) {
    // const menuItem = createContextMenuItem(key, parent, event);
    const menuItem = createContextMenuItem(key, parent, event);
    menuItem.setAttribute("data-position", event.target.dataset.position);
    menuItem.addEventListener("click", changeLabels);
  }
  setContextSubmenuPosition(event);
};

const changeLabels = (event) => {
  status.labels = event.target.innerText;
  populateBubbles("label", getlabels());
};

const changeLabelType = (event) => {
  status.labelType = event.target.innerText;
  status.labels = getDefaultLabels();
  populateBubbles("label", getlabels());
};

const changeChordShapeType = (event) => {
  status.chordShapeType = event.target.innerText;
  drawChords(event.target.dataset.position);

  // status.labels = getDefaultLabels();
  // populateBubbles("label", getlabels());
};

const changeKeyResolution = (event) => {
  status.keyResolution = event.target.innerText;
};

const contextCallbacks = {
  "Key resolution": callbackKeyResolution,
  "Make tonic": callbackMakeTonic,
  "Clock": callbackClock,
  "Label type": callbackLabelType,
  Labels: callbackLabels,
  "Chord type": callbackChordType,
  "Show chord": callbackChords,
};
