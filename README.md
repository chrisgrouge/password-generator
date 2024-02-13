# Password Generator
A simple password generator that allows users to create a random password based on their specified criteria. The user can choose the length of the password and select which character types to include (uppercase, lowercase, numbers, and special characters). The generated password is displayed and can be copied to the clipboard.


## Icon Font Generator
This is a simple tool to generate icon fonts from a set of SVG files. It utilizes the [`fantasticon` package](https://github.com/tancredi/fantasticon) to convert SVG icons into a custom font format. The generated font files are exported to the `./src/assets/fonts` directory which are imported into the projects CSS file. A JSON index file (`./src/assets/pg-icons.json`) is also generated to map the icon names to their respective Unicode characters. This file is used to prevent existing icon names from being overwritten when new icons are added to the project. Lastly, the files `./src/assets/pg-icons.css` and `./src/assets/pg-icons.html` are generated to provide a preview of the icon font.

### Adding Icons
1. Add SVG files to `./src/images/svgs` directory.
1. Run `npm run generate-icons` to generate the icon font files.
-*Note*: After generating a new font, if you see the icon is not displaying correctly, you may need to clear your browser cache.

### Deleting Icons
1. Remove the SVG file from the `./src/images/svgs` directory.
1. Run `npm run generate-icons` to regenerate the icon font files.


## TODO
- Build more component files for the password generator to make App.tsx more readable.
- Migrate to using react-aria components for accessibility and keyboard navigation support: select, slider (for password length), checkbox (for character types), buttons with icons and popovers (for copy to clipboard and regenerate).
- Add a "copied password" notification when a password is copied to the clipboard.
- Add a message about the word password length when no additional character types are selected.
- Add the "View Copied Passwords".