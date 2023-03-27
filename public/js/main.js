"use strict";

import { populateRandomWordsArray } from "./utils/randomWords.js";
import { getRandomWord } from "./utils/getRandomWord.js";
import { getRandomSymbol } from "./utils/getRandomSymbol.js";
import { getRandomNumber } from "./utils/getRandomNumber.js";
import { getRandomLargeNumber } from "./utils/getRandomLargeNumber.js";
import { getRandomUpper } from "./utils/getRandomUpper.js";
import { getRandomLower } from "./utils/getRandomLower.js";


// visible text elements
const result = document.getElementById('result');
const msg = document.getElementById('msg');


// buttons
const passwordTypeBtn = document.getElementById('passwordType');
// always clear value selection on page load
passwordTypeBtn.value = ""
const generateBtn = document.getElementById('generate');
const clipboardBtn = document.getElementById('clipboard');

const funcList = {
    wordlength: getRandomWord,
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    lgnumber: getRandomLargeNumber,
    symbol: getRandomSymbol,
};


//adding event listeners to the password type button
// only runs once to show the settings container
passwordTypeBtn.addEventListener("change", () => {

  document.querySelector(".container").style.display = "block"

}, {once: true});

//adding event listeners to the password type button
passwordTypeBtn.addEventListener("change", (pTypeEvent) => {

  // selecting all immediate div containers in the settings wrapper
  const settingsContainer = document.querySelectorAll('#settings > div');
  // loop over all containers in the above and hide them
  for (const container of settingsContainer) {
    container.style.display = "none"
	}

  // now that all are hidden we only want to show settings for the selected password type
  let chosenSetting = document.getElementById(pTypeEvent.target.value + "Settings");
  chosenSetting.style.display = "block"
});

// adding an event listener to the clipboard button to copy the password to the clipboard
clipboardBtn.addEventListener('click', () => {

    // storing the password in a variable
    const password = result.innerText;
    // checking if the password is empty
    if (!password) {
        return;
    }

    // copying the password to the clipboard
    // Resource: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
    navigator.clipboard.writeText(password);
    msg.innerText = 'Password copied to clipboard';
    // Resetting the copied message after 4 seconds
    setTimeout(() => {
        msg.innerText = '';
    }, 4000);
});

// adding an event listener to the generate button for creating a random string
generateBtn.addEventListener('click', () => {
  
  // find the settings container that's visible and select all inputs in container
  const settings = document.querySelectorAll('#settings > div:not([style*="display:none"]):not([style*="display: none"]) input');

  // creating a key value map of the visible inputs
  const settingsMap = new Map([...settings].map(input => {
      if (input.type == "checkbox") {
          return [input.name, input.checked]
      } else {
          return [input.name, input.value]
      }
  }));

//   console.log(settingsMap);

  // calling the generatePassword function to generate a random string and storing it in a variable
  result.innerText = generatePassword(settingsMap);

});




function generatePassword(map) {

    // variable to store the final password
    let generatedPassword = '';

    // starting variable to store total number of character types to be included in the password
    let typesCount = 0;

    let isWordBasedPassword = 0;

    // loop through each item the user selected. 
    // items selected with return 'true'
    // if 'true' add to the total of typesCount
    // adding to the total of typesCount when input[name="wordlength"] too
    // map key value pair can be accessed using `${key}: ${value}`
      // this helped me so much: https://javascript.info/map-set
    map.forEach((value, key) => {
        if (value === true || key == "wordlength") {
            typesCount++

            if (key == "wordlength") {
              isWordBasedPassword++
            }
        }
    });

    // don't run the function if typesCount is 0 meaning no character types were selected by the user
    if (typesCount === 0) {
        return '';
    }

    // a map to store the types of characters to be included in the password. Added a sort to randomize the order character types for the final random password
        // for character-based passwords we want to randomize the order in which the password characters are created. To do that:
        // We return a random number between -0.5 and 0.5 in the callback to let us shuffle the array. This is because if the returned number is negative, then the position of 2 elements your iterating through stays the same. Otherwise, they’re swapped.
        // there's no promise that all selected character types will be included in the password but with a minimum of eight characters in the password makes it statistically hard but certainly not impossible.

    //Now, I don't want the sorting to happen on word-based passwords so I'm searching the variable isWordBasedPassword to see if I need to sort or not.
    // If I want to sort, then I'm generating the random number between -0.5 and 0.5, otherwise it remains blank
    let sorting
    if (isWordBasedPassword === 0) {
      sorting = .5 - Math.random();
    }
    
    const typesArr = new Map(
        Array.from(map).sort(() => sorting).filter(([key, value]) => {
            if (key == "wordlength" || value === true) {
                return true;
            }
            return false;
        }),
    );
    // console.log("typesArr", typesArr);
    // console.log("typesArr size", typesArr.size);

    // I need to determine how many times to run the funcList functions. So, I start out with a blank variable
    let length = "";

    // if user selects to user random password they'll select a length of the password. In this instance I'll just get the length of the password they input.
    if (map.get("length")) {
        length = map.get("length")
    }

    // however, if a user selects the word based password I need to treat each word as one run of the function list and mulitply by how many typesCount there are so I can include numbers or dashses between the words and still have the number of words the user selected.
    // So, I multiply the number of words they input by the typesCount so the funcList runs that many times.
    if (map.get("wordlength")) {
        length = (Number(map.get("wordlength")) * typesCount) - ((typesCount - 1));
      }
      
      // generate a character in the list of character types and stop when the length of the password matches the length selected 
      // for each type find the appropriate function in the funcList
      for (let l = 0; l < length; l += typesCount) {
        
        // for word-based passwords I want to end the password with a word, not any of the other types the user selected.
        // To do that I'm checking if wordlength is true, meaning this is a word-based password.
        // Then I'm figuring out at what stage of the password generation we're in. When we're on the last step I only want to generate on word.
        // And because the typesArr.forEach() loop will only run when l is less than length, I'll get true when (lenght - 1) equals l.
        if (typesArr.get("wordlength") && l === (length - 1)) {
          generatedPassword += funcList["wordlength"]();
        }
        else {
          typesArr.forEach((value, key) => {
            // adding to the generated password by running the function in the funcList with whatever "key" is coming in
            generatedPassword += funcList[key]();

            // for word-based passwords that don't have any character types checked I want to separate each words with a dash.
            // So, I add a dash after the word gets returned from the function above.
            if (typesArr.get("wordlength") && typesArr.size === 1) {
              generatedPassword += "-"
            }
          });
        }
    }

    // getting the final password by slicing the generatedPassword
    const finalPassword = generatedPassword.slice(0, map.get("length"));

    // returning the final password
    return finalPassword;
}



// manually run the function to populate the array of words that could be used.
// 200 is how many words I'm requesting, 7 is the length of the words. A this time I'm not using 7 but leaving in case I want to use it in the future
populateRandomWordsArray(200, 7);

