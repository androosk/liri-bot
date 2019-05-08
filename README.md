# Liri-Node-App
Language Interpretation and Recognition Interface. This is a console based Node.js app that searches various APIs based on text commands entered by the user.

# APIs in use
- OMDB Movie Database
- Spotify
- Bandsintown

# NPM Dependencies
- on command line run npm init
- dotenv - to protect API assets - Make sure to create your own file with your own API keys
- node-spotify-api - to get information from Spotify
- axios - to get information from OMDB and Bandsintown
- moment - to format date for Bandsintown query

# Usage Instructions
- Accepts four separate query commands with **parameters**
  1. concert-this **band or artist**
  2. spotify-this-song **song with or without artist**
  3. movie-this **movie name**
  4. do-what-it-says **retrieves command from a separate file**
- Query results are stored in a text file (log.txt)
- Query results are displayed in the console

# Features
- Help function - If user runs $ node liri.js with no other parameters a help list is displayed
- Error catching - errors are caught and a simple message is displayed
- Storage - search results are stored locally on user's computer for future reference

## For screen shots of usage, please refer to the images folder in this repository

## For an example of the log.txt file, I have included one in this repository
