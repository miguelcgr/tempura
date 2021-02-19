"use strict";

const dropdownButton = document.getElementById("dropdown");
const menu = document.getElementById("menu");

function dropmenu() {
  menu.classList.toggle("hide");
}

dropdownButton.addEventListener("mouseover", () => {
  menu.classList.remove("hide");
  dropdownButton.classList.add("dropdown-js");
});

menu.addEventListener("mouseover", () => {
  menu.classList.remove("hide");
  dropdownButton.classList.add("dropdown-js");
});

menu.addEventListener("mouseout", () => {
  menu.classList.add("hide");
  dropdownButton.classList.remove("dropdown-js");
});

window.addEventListener("load", dropmenu);
