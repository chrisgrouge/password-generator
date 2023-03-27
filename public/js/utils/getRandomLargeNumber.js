"use strict";

//function to get a random large number
export function getRandomLargeNumber() {
  const range = {min: 10, max: 999}
  const delta = range.max - range.min

  return Math.round(range.min + Math.random() * delta).toString();
}