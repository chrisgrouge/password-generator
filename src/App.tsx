import { useState, useEffect } from 'react'
import { generate } from "random-words";
import 'tailwindcss/tailwind.css'
import './App.css'
import TextInput from './components/Input';
import { SelectDropdown, SelectOption } from './components/Select';
import type {Key} from 'react-aria-components';

type PasswordType = 'random' | 'easy' | 'word' | 'pin';
type PasswordOptions = {
  length: number;
  numbers: boolean;
  symbols: boolean;
  uppercase: boolean;
  type?: Extract<PasswordType, 'easy' | 'pin'>;
};

function App() {
  const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
  const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const NUMBERS = '0123456789';
  const SYMBOLS = '!@#$%^&*()_+{}:"<>?|[];\',./';
  const EASY_LOWERCASE_LETTERS = 'abcdefghkmnpqrstuvwxyz';
  const EASY_UPPERCASE_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const EASY_NUMBERS = '23456789';
  const EASY_SYMBOLS = '@#$*+-&%';
  const initialPasswords = JSON.parse(sessionStorage.getItem('passwords') || '[]');
  
  const [passwordType, setPasswordType] = useState<PasswordType>('random');
  const [passwordLength, setPasswordLength] = useState(18);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeUpperCase, setIncludeUpperCase] = useState(true);
  const [password, setPassword] = useState('');
  const [storedPasswords, setStoredPasswords] = useState<string[]>(initialPasswords);

  useEffect(() => {
    generatePassword();
  }, [passwordType, passwordLength, includeNumbers, includeSymbols, includeUpperCase]);

  const getRandomChar = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

  const generateRandomWord = (maxLength: number): string => {
    let word = generate({ exactly: 1, maxLength: maxLength })[0];
    includeUpperCase && (word = word.charAt(0).toUpperCase() + word.slice(1));
    return word;
  };
  
  const generateRandomPassword = ({ length, numbers, symbols, uppercase, type }: PasswordOptions): string => {
    let chars = '';
    switch (type) {
      case 'pin':
        chars = NUMBERS;
        break;
      case 'easy':
        chars = EASY_LOWERCASE_LETTERS;
        break;
      default:
        chars = LOWERCASE_LETTERS;
        break;
    }

    if (type !== 'pin') {
      numbers && (chars += type === 'easy' ? EASY_NUMBERS : NUMBERS);
      symbols && (chars += type === 'easy' ? EASY_SYMBOLS : SYMBOLS);
      uppercase && (chars += type === 'easy' ? EASY_UPPERCASE_LETTERS : UPPERCASE_LETTERS);
    }
    return Array.from({ length }, () => getRandomChar(chars)).join('');
  };

  const generateWordPassword = ({ length, numbers, symbols }: PasswordOptions): string => {
    let password = '';

    for (let i = 0; i < length; i++) {
        const wordMaxLength = Math.min(length - password.length, length);

        // todo: add something on the front end saying we'll generate as many random words as we can before the next random word would make the password too long but encourage the use of additional controls to get the password to the desired length

        // if we can't add anymore words without making the password too long, and there's no numbers or symbols, break the loop
        if (wordMaxLength < 2 && !numbers && !symbols) {
            break;
        }

        // if there's at least two more characters needed for the password length, generate a random word with a max length of the remaining length of the password minus the length of the current password string
        if (wordMaxLength >= 2) {
            const word = generateRandomWord(wordMaxLength);
            password += word;
            i += word.length - 1;
        }

        // if there's at least one more character needed for the password length, add a number or symbol
        if (password.length < length) {
            if (numbers && symbols) {
                const chars = Math.random() < 0.5 ? NUMBERS : SYMBOLS;
                password += getRandomChar(chars);
            }
            numbers && (password += getRandomChar(NUMBERS));
            symbols && (password += getRandomChar(SYMBOLS));
        }
    }
    
    return password;
};

  const passwordGenerators: Record<PasswordType, (options: PasswordOptions) => string> = {
    random: generateRandomPassword,
    easy: (options) => generateRandomPassword({ ...options, type: 'easy' }),
    word: generateWordPassword,
    pin: (options) => generateRandomPassword({ ...options, type: 'pin' }),
  };

  const generatePassword = () => {
    const generate = passwordGenerators[passwordType];
    if (generate) {
      const password = generate({ length: passwordLength, numbers: includeNumbers, symbols: includeSymbols, uppercase: includeUpperCase});
    setPassword(password);
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    generatePassword();
  };

  const handleRegenerateClick = () => {
    generatePassword();
  };

  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(password);
    if (!storedPasswords.includes(password)) {
      const newStoredPasswords = [...storedPasswords, password];
      setStoredPasswords(newStoredPasswords);
      sessionStorage.setItem('passwords', JSON.stringify(newStoredPasswords));
    }
  };

  const handlePasswordTypeChange = (selectedValue: Key) => {
    console.log("selectedValue", selectedValue);
  }

  return (
    <>
<main>
  <section className="min-h-screen flex flex-col justify-center items-center p-8 md:p-24">
    <div className="max-w-[850px] w-full">
      <h1 className="font-averta-bold text-3xl leading-5 mb-4 text-center" style={{ fontSize: '3rem', lineHeight: '1.2' }}>
        Never remember a password again.<br />
        Generate, save, and forget.
      </h1>
      <p className="text-base mb-14 text-center">Generate safe, random passwords and save them in your password manager.<br />Customizable, private, and secure.</p>
      {/* generated password output */}
      <div className="flex flex-col w-full">
        {/* visually hidden input for copying but include the label */}
        <TextInput
          aria-label="Generated Password"
          hidden
          id="passwordInput"
          label={`Generated Password (${password.length} characters)`}
          isReadOnly
          value={password}
        />
        <div className="relative mb-8">
          {/* visual display. Classes identical to Input component when visible */}
          <div
            aria-hidden="true"
            className="p-4 pb-3 pr-100 w-full bg-white rounded-md font-courier text-3xl leading-normal text-left break-all tracking-wider text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            id="passwordDisplay"
          >
            {password.split('').map((char, index) => {
              let className = '';
              switch (true) {
                case /[\d]/.test(char):
                  className = 'number text-blue';
                  break;
                case /[^\w\s]/.test(char):
                  className = 'symbol text-red';
                  break;
                default:
                  className = 'letter';
                  break;
              }

              return <span key={index} className={className}>{char}</span>;
            })}
          </div>
          {/* actions to take on the current password */}
          <div className="absolute top-0 bottom-0 right-3 m-auto flex flex-row items-center space-x-3">
            <button
              className="pg__action-button pg__icon-font__copy bg-transparent border-none text-gray-800 text-xl leading-6 cursor-pointer w-8 h-8"
              data-copy-button
              onClick={handleCopyButtonClick}
              aria-label="Copy to Clipboard"
            >
              &nbsp;
            </button>
            <button
              className="pg__action-button pg__icon-font__regenerate bg-transparent border-none text-gray-800 text-xl leading-6 w-8 h-8 cursor-pointer"
              id="regenerateButton"
              onClick={handleRegenerateClick}
              aria-label="Regenerate Password"
            >
              &nbsp;
            </button>
          </div>
        </div>
      </div>

      {/* generate password controls */}
      <form id="passwordGeneratorForm" onSubmit={handleFormSubmit}>
        <div className="flex flex-col w-full">
          {/* main controls */}
          <div className="flex flex-row items-start justify-between space-x-8">
            {/* input container for select */}
            <div className="flex flex-col w-full relative mb-8">
              <label className="font-averta-bold font-normal mb-2" htmlFor="passwordType">Password Type</label>
              <select
                className="appearance-none bg-transparent border-2 border-white border-opacity-20 rounded-full text-white text-base leading-6 outline-none w-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue"
                id="passwordType"
                aria-label="Password Type"
                style={{ letterSpacing: '-.01rem' }}
                value={passwordType}
                onChange={(event) => setPasswordType(event.target.value as PasswordType)}
              >
                <option value="random">Random</option>
                <option value="easy">Easy to Read</option>
                <option value="word">Word-based</option>
                <option value="pin">Pin</option>
              </select>
              
              {/* custom select arrow */}
              <div className="pg__main-controls__select-arrow pg__icon-font pg__icon-font__select-arrow absolute bottom-4 right-6 flex-none self-start"></div>
              {/* <SelectDropdown
                label='Password Type'
                onSelectionChange={handlePasswordTypeChange}
              >
                <SelectOption value={{ type: "random" }}>Random</SelectOption>
                <SelectOption value={{ type: "easy" }}>Easy to Read</SelectOption>
                <SelectOption value={{ type: "word" }}>Word-based</SelectOption>
                <SelectOption value={{ type: "pin" }}>Pin</SelectOption>
              </SelectDropdown> */}
            </div>
            {/* input container for slider */}
            <div className="flex flex-col w-full">
              <label className="font-averta-bold font-normal mb-2" htmlFor="passwordLength">Password Length</label>
              <input 
                className="bg-transparent border-2 border-white border-opacity-20 rounded-full text-white text-base leading-6 outline-none w-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue" 
                type="number" 
                id="passwordLength" 
                min="8" 
                max="50" 
                aria-label="Password Length" 
                value={passwordLength}
                onChange={(event) => setPasswordLength(Number(event.target.value))}
              />
            </div>
          </div>
          {/* additional controls */}
          <div className="mb-8 p-8 bg-black border-2 border-blacker rounded-md">
            <fieldset>
              <legend className="hidden">Additional Controls</legend>
              <div className="flex flex-row items-center justify-center space-x-8">
                <div className="relative cursor-pointer">
                  <input
                    className='pg__additional-controls__checkbox h-0 left-0 opacity-0 absolute w-0 -z-10'
                    type="checkbox"
                    id="includeUpperCase"
                    aria-label="Include UpperCase Letters"
                    checked={includeUpperCase}
                    onChange={(event) => setIncludeUpperCase(event.target.checked)}
                    disabled={passwordType === 'pin'}
                  />
                  <label
                    className={`ml-8 cursor-pointer ${passwordType === 'pin' ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    htmlFor="includeUpperCase"
                  >
                    UpperCase
                  </label>
                </div>
                {/* include numbers checkbox */}
                <div className="relative cursor-pointer">
                  <input
                    className='pg__additional-controls__checkbox h-0 left-0 opacity-0 absolute w-0 -z-10'
                    type="checkbox"
                    id="includeNumbers"
                    aria-label="Include Numbers"
                    checked={includeNumbers}
                    onChange={(event) => setIncludeNumbers(event.target.checked)}
                  />
                  <label
                    className={`ml-8 cursor-pointer ${passwordType === 'pin' ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    htmlFor="includeNumbers"
                  >
                    Numbers
                  </label>
                </div>
                {/* include symbols checkbox */}
                <div className="relative cursor-pointer">
                  <input
                    className='pg__additional-controls__checkbox h-0 left-0 opacity-0 absolute w-0 -z-10'
                    type="checkbox"
                    id="includeSymbols"
                    aria-label="Include Symbols"
                    checked={includeSymbols}
                    onChange={(event) => setIncludeSymbols(event.target.checked)}
                    disabled={passwordType === 'pin'}
                  />
                  <label
                    className={`ml-8 cursor-pointer ${passwordType === 'pin' ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    htmlFor="includeSymbols"
                  >
                    Symbols
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </form>

      {/* copy button */}
      <div className="flex flex-col items-center gap-8 mb-8">
        <button
          className="px-4 py-2 bg-blue text-white rounded-full font-averta-bold transition-colors duration-200 ease-in-out hover:bg-blue-hover cursor-pointer border-0"
          data-copy-button
          onClick={handleCopyButtonClick}
        >
          Copy to Clipboard
        </button>
      </div>


      {/* //TODO: show passwords container */}
      {/* <hr />
      <div className="flex flex-col items-center gap-8 mt-8">
        <p className="text-base text-center"><strong className="font-averta-bold">Ever changed your password and forgot to save it? Don't worry, I got you.</strong> <br />All copied passwords are stored locally with your session. Try it out and see! <br />They're gone after you close the tab.</p>
        <button
          className="px-4 py-2 bg-blue text-white rounded-full font-averta-bold transition-colors duration-200 ease-in-out hover:bg-blue-hover cursor-pointer border-0"
          id="showStoredPasswords"
          onClick={handleShowStoredPasswordsClick}
        >
          Show Stored Passwords
        </button>
      </div> */}
    </div>
  </section>

  {/* stored passwords */}
  {/* <section className="stored-passwords flex flex-col items-center bg-white text-black">
    <div id="storedPasswords">test</div>
  </section> */}
</main>
    </>
  )
}

export default App
