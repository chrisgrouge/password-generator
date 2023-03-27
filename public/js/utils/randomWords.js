"use strict";

// where all random words will be stored
export const randomWords = [];

// async function to wait for the XHR request to complete to then populate the array
export async function populateRandomWordsArray(numOfWords, lengthOfWord) {
  let result = await wordsArray(numOfWords, lengthOfWord);
  return randomWords.push(...result);
}

// submit request to collect random words from the random word api
const wordsArray = (number, length) => {
  return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      //open a get request with the remote server URL
      xhr.open("GET", `./random?&number=${number}`)
      //triggered when the response is completed
      xhr.onload = function() {
          if (this.status === 200) {
              //parse JSON datax`x and return it
              resolve(JSON.parse(xhr.responseText))
          } 
          else {
              reject({
                  status: this.status,
                  statusText: xhr.statusText
              });
          }
      }
      //triggered when the request fails
      xhr.onerror = function () {
          reject({
              status: this.status,
              statusText: xhr.statusText
          });
      };
      //initiates the send of the request
      xhr.send();
  });
}