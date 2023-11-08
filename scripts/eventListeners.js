import { status } from "./dataStructure.js";
import { handleContextClick, submenus, hideContextSubmenu, showContextSubmenu } from "./contextMenu.js";

// adds click events to elements with the passed classname
export const addClickEvents = (className, callbackFunc) => {
  // className (string) specifies the CSS selector for the elements to have a click eventListener attached
  // callbackFunc (function) is the function to call when the element is clicked
  document.querySelectorAll(`.${className}`).forEach((elem) => {
    elem.addEventListener("click", () => {
      if (status.respondToClicks) {
        callbackFunc(elem);
      }
    });
  });
};

export const addContextClickEvents = () => {
  document.querySelectorAll(".note.bubble").forEach((element) => {
    element.addEventListener("contextmenu", handleContextClick);
  });

  document.addEventListener("click", (event) => {
    // if (event.target.classList.contains("bubble")) {
    //   return;
    // }
    const textContent = event.target.querySelector(".context-text")?.textContent;
    const isSubmenu = event.target.classList.contains("submenu");
    if (submenus.has(textContent) && !isSubmenu) {
      if (status.contextSubmenuVisible) {
        hideContextSubmenu();
      } else {
        showContextSubmenu();
      }
      contextMenu.classList.remove("hidden");
    } else {
      contextMenu.classList.add("hidden");
      hideContextSubmenu();
    }
  });
};
