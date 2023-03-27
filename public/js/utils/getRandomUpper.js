"use strict";

// fucntion to get random uppercase letter
export function getRandomUpper() {
  return String.fromCharCode(
      Math.floor(Math.random() * 26) + 65
  );
}