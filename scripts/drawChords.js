import { status, svgContainer, container, chordPatternsInScale, chordShapes, intervalToPosition, updateHeader, getConnector } from "./dataStructure.js";
import { getElementCenter } from "./helperFunctions.js";

// clear svg canvas
const clearCanvas = (container) => {
  [...container.children].forEach((child) => {
    child.remove();
  });
};

const clearChords = (container) => {
  container.querySelectorAll(".connector.chordNote").forEach((connector) => {
    connector.classList.remove("chordNote");
  });
};

// create an svgLine element
function createSVGLine(x1, y1, x2, y2) {
  // x1 (number) is the start point x coordinate
  // y1 (number) is the start point y coordinate
  // x2 (number) is the end point x coordinate
  // y2 (number) is the end point y coordinate
  const svgNS = "http://www.w3.org/2000/svg";
  const line = document.createElementNS(svgNS, "line");
  line.setAttribute("class", "svgLine");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  return line;
}

export const drawChords = (position) => {
  clearCanvas(svgContainer);
  clearChords(container);

  if (status.chordShapeType == "No chord") {
    return;
  }

  const scale = status.scale;
  const chordShapeType = status.chordShapeType;
  const chordShape = chordPatternsInScale[chordShapeType][scale][position];
  const chordPattern = chordShapes[chordShapeType][chordShape];
  status.chordShape = chordShape;
  drawChordLines(svgContainer, chordPattern, position);
  updateHeader();
};

// draw chord shapes
function drawChordLines(container, pattern, startPosition = 0) {
  // container (element) is the svg container element
  // pattern is an array containing intervals which defines which nodes to join
  if (!pattern) {
    return;
  }

  // get index value of index of root position
  const offset = parseInt(startPosition);
  // for each interval in the pattern array
  pattern.forEach((startInterval, index) => {
    // convert the interval to a start position in the circle
    const startPoint = intervalToPosition(startInterval);
    // calculate the end interval as either the next interval in the pattern array
    // or the first position in the array if the current interval is the last
    const endInterval = index < pattern.length - 1 ? pattern[index + 1] : pattern[0];
    // convert the end interval to a position in the circle
    const endPoint = intervalToPosition(endInterval);
    // draw a line between the start point and the end point
    const startConnector = getConnector("chordLabel", (startPoint + offset) % 12);
    const endConnector = getConnector("note", (endPoint + offset) % 12);
    startConnector.classList.add("chordNote");
    startConnector.textContent = startInterval;
    drawLine(container, startConnector, endConnector);
  });
}

// draws an svg line between 2 specified connectors
const drawLine = (svgContainer, connector1, connector2) => {
  // svgContainer (element) is the parent svg container
  // connector1 is the start connector element to join - 0 is the root
  // connector2 is the end connector element to join

  const connector1Center = getElementCenter(connector1);
  const connector2Center = getElementCenter(connector2);
  const containerRect = svgContainer.getBoundingClientRect();

  // Calculate coordinates for the line
  const x1 = connector1Center.x; //+ connector1Rect.width / 2;
  const y1 = connector1Center.y - containerRect.y;
  const x2 = connector2Center.x;
  const y2 = connector2Center.y - containerRect.y;

  const line = createSVGLine(x1, y1, x2, y2); // Replace with your desired coordinates
  svgContainer.appendChild(line);
  return line;
};
