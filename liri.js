require('dotenv').config()
let axios = require('axios')
let moment = require('moment')
let Spotify = require('node-spotify-api')
let keys = require('./keys.js')
let fs = require('fs')
let spotify = new Spotify(keys.spotifyKeys)
let movieBase = keys.omdb
let bandsInTown = keys.bands
let goGetAxiosURL = ''
let switchStr = process.argv[2]
let srchStr = process.argv.slice(3).join(' ')

//Command logic
function whatWeDoin() {
  switch(switchStr) {
    case 'concert-this':
      var b = srchStr.replace(/ /g,'%20')
      goGetAxiosURL = 'https://rest.bandsintown.com/artists/' + b + '/events?app_id=' + bandsInTown.apiKey
      concertGet()
      break
    case 'spotify-this-song':
      spotifyGet()
      break
    case 'movie-this':
      goGetAxiosURL = 'http://www.omdbapi.com/?t=' + srchStr + '&y=&plot=short&apikey=' + movieBase.apiKey
      movieGet()
      break
    case 'do-what-it-says':
      randomGet()
      break
    default:
      console.log('VALID COMMANDS:\nconcert-this <band or artist name>\nspotify-this-song <song and artist>\nmovie-this <movie name>\ndo-what-it-says <uses input query from random.txt file>')
  }
}
//Bands in town request
function concertGet() {
  axios.get(goGetAxiosURL)
    .then(function(response) {
      let bandSrch = response.data
      if (bandSrch.length != 0) {
        for (i=0;i<bandSrch.length;i++) {
          console.log(`\n==========================================================\n`)
          console.log('Venue: ' + bandSrch[i].venue.name)
          console.log('City: ' + bandSrch[i].venue.city)
          if (bandSrch[i].venue.region) {console.log('State: ' + bandSrch[i].venue.region)}
          console.log('Country: ' + bandSrch[i].venue.country)
          let eventDate = moment(bandSrch[i].datetime).format('MM/DD/YYYY')
          console.log('Event Date: ' + eventDate)
        }
        console.log(`\n==========================================================\n`)
      }
      else {
        console.log(`\n==========================================================\n`)
        console.log('SORRY, EVENT NOT FOUND')
        console.log(`\n==========================================================\n`)
      }
    })
    .catch(function(error) {
      console.log(`\n==========================================================\n`)
      console.log('SORRY, EVENT NOT FOUND')
      console.log(`\n==========================================================\n`)
    })
  }
//Spotify request
function spotifyGet() {
  if (!srchStr) {
    srchStr = "the sign ace of base"
  }
  spotify.search ({
    type: 'track',
    query: srchStr,
    limit: 1
  })
  .then(function(response) {
    let srchArray = response.tracks.items
    for (i=0;i<srchArray.length;i++) {
      console.log(`\n==========================================================\n`)
      console.log('Artist(s): ' + srchArray[i].album.artists[0].name)
      console.log('Song Name: ' + srchArray[i].name)
      console.log('Spotify Preview Link: ' + srchArray[i].external_urls.spotify)
      console.log('Album: ' + srchArray[i].album.name)
    }
    console.log(`\n==========================================================\n`)
  })
  .catch(function(error) {
    console.log('SORRY WE COULDN\'T FIND ANYTHING FOR YOUR SEARCH')
  })
}
//OMDB Request
function movieGet() {
  axios.get(goGetAxiosURL).then(
    function(response) {
      console.log(`\n==========================================================\n`)
      console.log('Title: ' + response.data.Title)
      console.log('Release Year: ' + response.data.Year)
      console.log('IMDB Rating: ' + response.data.imdbRating)
      console.log('Rotten Tomatoes Rating: ' + response.data.Ratings[1].Value)
      console.log('Country of origin: ' + response.data.Country)
      console.log('Language: ' + response.data.Language)
      console.log('Plot: ' + response.data.Plot)
      console.log('Starring: ' + response.data.Actors)
      console.log(`\n=========================================================\n\n`)
    })
    .catch(function(error) {
      console.log('SORRY INCOMPLETE OR MISSING INFORMATION')
    })
  }
// Do what it says request
function randomGet() {
  fs.readFile('random.txt', 'utf8', function (error, data) {
    if (error) {
        return console.log('SORRY, NOTHING HERE')
    }
    let searchArray = data.split(',')
    switchStr = searchArray[0]
    srchStr = searchArray[1]
    whatWeDoin()
})
}
//Run command logic function
whatWeDoin()
