// visible text elements
const result = document.getElementById('result');
const msg = document.getElementById('msg');

// input selections
const lengthInput = document.getElementById('length');
const uppercase = document.getElementById('uppercase');
const lowercase = document.getElementById('lowercase');
const numbers = document.getElementById('number');
const symbols = document.getElementById('symbol');

// buttons
const passwordTypeBtn = document.getElementById('passwordType');
// always clear value selection on page load
passwordTypeBtn.value = ""
const generateBtn = document.getElementById('generate');
const clipboardBtn = document.getElementById('clipboard');

const funcList = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
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
  
  // select the settings container that's visible
  const settings = document.querySelectorAll('#settings > div:not([style*="display:none"]):not([style*="display: none"])');

  const length = +lengthInput.value;
  const hasLower = lowercase.checked;
  const hasUpper = uppercase.checked;
  const hasNumber = numbers.checked;
  const hasSymbol = symbols.checked;
  // calling the generatePassword function to generate a random string and storing it in a variable
  result.innerText = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
});

// function generatePassword to generate a random string
function generatePassword(lower, upper, number, symbol, length) {
    // a variable to store the final password
    let generatedPassword = '';
    // a variable to store the types of characters to be included in the password
    const typesCount = lower + upper + number + symbol;
    // an array to store the types of characters to be included in the password
    const typesArr = [{ lower }, { upper }, { number }, { symbol }, ].filter((item) => Object.values(item)[0]);

    // checking if the typesCount is 0 then return 
    if (typesCount === 0) {
        return '';
    }
    // looping through the length of the password as per the input from the user
    for (let i = 0; i < length; i += typesCount) {
        // looping through the typesArr
        typesArr.forEach((type) => {
            // getting the key of the type
            const funcName = Object.keys(type)[0];
            // adding the random character to the generatedPassword
            generatedPassword += funcList[funcName]();
        });
    }
    // getting the final password by slicing the generatedPassword
    const finalPassword = generatedPassword.slice(0, length);

    // returning the final password
    return finalPassword;
}
// function to get random lowercase letter
function getRandomLower() {
    return String.fromCharCode(
        Math.floor(Math.random() * 26) + 97
    );
}

// fucntion to get random uppercase letter
function getRandomUpper() {
    return String.fromCharCode(
        Math.floor(Math.random() * 26) + 65
    );
}

// function to get a random number
function getRandomNumber() {
    return String.fromCharCode(
        Math.floor(Math.random() * 10) + 48
    );
}

// function to get a random symbol
function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.';
    return symbols[
        Math.floor(Math.random() * symbols.length)
    ];
}