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
let logVar = []
//Command logic
function whatWeDoin() {
  logVar.push(switchStr + '\n')
  logVar.push(srchStr + '\n')
  switch(switchStr) {
    case 'concert-this':
      var b = srchStr.replace(/ /g,'%20')
      goGetAxiosURL = 'https://rest.bandsintown.com/artists/' + b + '/events?app_id=' + bandsInTown.apiKey
      concertGet()
      break
    case 'spotify-this-song':
      if (!srchStr) {
        srchStr = "the sign ace of base"
      }
      spotifyGet()
      break
    case 'movie-this':
      if (!srchStr) {
        srchStr = 'Mr. Nobody'
      }
      goGetAxiosURL = 'http://www.omdbapi.com/?t=' + srchStr + '&y=&plot=short&apikey=' + movieBase.apiKey
      movieGet()
      break
    case 'do-what-it-says':
      randomGet()
      break
    default:
      logVar.push('VALID COMMANDS:\nconcert-this <band or artist name>\nspotify-this-song <song and artist>\nmovie-this <movie name>\ndo-what-it-says <uses input query from random.txt file>\n')
      finishUp()
  }
}
//Bands in town request
function concertGet() {
  axios.get(goGetAxiosURL)
    .then(function(response) {
      let bandSrch = response.data
      if (bandSrch.length != 0) {
        for (i=0;i<bandSrch.length;i++) {
          logVar.push('==========================================================\n')
          logVar.push('Venue: ' + bandSrch[i].venue.name + '\n')
          logVar.push('City: ' + bandSrch[i].venue.city + '\n')
          if (bandSrch[i].venue.region) {logVar.push('State: ' + bandSrch[i].venue.region + '\n')}
          logVar.push('Country: ' + bandSrch[i].venue.country + '\n')
          let eventDate = moment(bandSrch[i].datetime).format('MM/DD/YYYY')
          logVar.push('Event Date: ' + eventDate + '\n')
        }
        logVar.push('==========================================================\n')
        finishUp()
      }
      else {
        noGo()
      }
    })
    .catch(function(error) {
      noGo()
    })
  }
//Spotify request
function spotifyGet() {
  spotify.search ({
    type: 'track',
    query: srchStr,
    limit: 1
  })
  .then(function(response) {
    let srchArray = response.tracks.items
    for (i=0;i<srchArray.length;i++) {
      logVar.push('==========================================================\n')
      logVar.push('Artist(s): ' + srchArray[i].album.artists[0].name + '\n')
      logVar.push('Song Name: ' + srchArray[i].name + '\n')
      logVar.push('Spotify Preview Link: ' + srchArray[i].external_urls.spotify + '\n')
      logVar.push('Album: ' + srchArray[i].album.name + '\n')
    }
    logVar.push('==========================================================\n')
    finishUp()
  })
  .catch(function(error) {
    noGo()
  })
}
//OMDB Request
function movieGet() {
  axios.get(goGetAxiosURL).then(
    function(response) {
      logVar.push('==========================================================\n')
      logVar.push('Title: ' + response.data.Title + '\n')
      logVar.push('Release Year: ' + response.data.Year + '\n')
      logVar.push('IMDB Rating: ' + response.data.imdbRating + '\n')
      logVar.push('Rotten Tomatoes Rating: ' + response.data.Ratings[1].Value + '\n')
      logVar.push('Country of origin: ' + response.data.Country + '\n')
      logVar.push('Language: ' + response.data.Language + '\n')
      logVar.push('Plot: ' + response.data.Plot + '\n')
      logVar.push('Starring: ' + response.data.Actors + '\n')
      logVar.push('=========================================================\n')
      finishUp()
    })
    .catch(function(error) {
      noGo()
    })
  }
// Do what it says request
function randomGet() {
  fs.readFile('random.txt', 'utf8', function (error, data) {
    if (error) {
        noGo()
    }
    let searchArray = data.split(',')
    switchStr = searchArray[0]
    srchStr = searchArray[1]
    whatWeDoin()
})
}
//In case of error or unresolvable request
function noGo() {
  logVar.push('==========================================================\n')
  logVar.push('SORRY YOUR REQUEST COULD NOT BE COMPLETED\n')
  logVar.push('==========================================================\n')
  finishUp()
}
//Write results to log.txt and show results on screen
function finishUp() {
  for (i=0;i<logVar.length;i++) {
    var z = logVar[i]
    console.log(z)
    fs.appendFileSync('log.txt', z, function(err){
      if (err) {
        console.log(err)
      }
    })
  }
}

//Run command logic function
whatWeDoin()
