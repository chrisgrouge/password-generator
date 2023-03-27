"use strict";

// function to get random lowercase letter
export function getRandomLower() {
  return String.fromCharCode(
      Math.floor(Math.random() * 26) + 97
  );
}