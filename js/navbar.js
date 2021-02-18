"use strict";

const dropdownButton = document.getElementById("dropdown");
const menu = document.getElementById("menu");

function dropmenu() {
  menu.style = "none";
  dropdownButton.addEventListener("click", showNav);
  dropdownButton.addEventListener("click", hideNav);
}

function showNav() {
  console.log("show");
  menu.style.display = "block";
}

function hideNav() {
  console.log("hide");
  menu.style.display = "none";
}

// window.onmouseover = function () {
//   menu.style.display = "block";
// };

// window.onmouseout = function () {
//   menu.style.display = "none";
// };
