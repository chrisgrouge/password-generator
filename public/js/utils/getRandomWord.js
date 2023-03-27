"use strict";

import { randomWords } from "./randomWords.js";

// function to get a random word from a pre-populated array
export function getRandomWord() {
  return randomWords[Math.floor(Math.random() * randomWords.length)]
}