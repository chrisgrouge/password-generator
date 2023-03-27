"use strict";

// function to get a random symbol
export function getRandomSymbol() {
  const symbols = '!@#$%^&*(){}[]=<>/,.';
  return symbols[
      Math.floor(Math.random() * symbols.length)
  ];
}