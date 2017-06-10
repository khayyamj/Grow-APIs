const express = require('express')
const swapi = require('swapi-node')

var app = express()
var allCharacters = []

app.get('/', (req, res) => res.send('Welcome to Swapi'))

var getCharacters = function () {
  for (var i = 1; i <= 9; i++) {
    swapi.get(`http://swapi.co/api/people?page=${i}`).then(result => {
      result.results.map((character, i) => allCharacters.push(character))
    }).catch(err => res.send(err))
  }
}

// returns 50 characters
app.get('/characters', (req, res) => {
  getCharacters()
  var sorting = function() {
    allCharacters.sort((a, b) => {
      if (req.query.sort === 'name') {
        if (a[req.query.sort].toLowerCase() < b[req.query.sort].toLowerCase()) return -1
        if (a[req.query.sort].toLowerCase() > b[req.query.sort].toLowerCase()) return 1
        return 0
      }
      return a[req.query.sort] - b[req.query.sort]
    })
    var displayCharacters = allCharacters.slice(0, 50)
    res.send(displayCharacters)
  }
  var checking = function() {
    setTimeout(function() {
      if (allCharacters.length >= 87) {
        sorting()
      } else {
        checking()
      }
    }, 1000)
  }
  checking()
})

// returns specific character
app.get('/character/:name', (req, res) => {
  getCharacters()
  var name = req.params.name;
  setTimeout( () => {
    swapi.get(`http://swapi.co/api/people/`).then((result) => {
      var person = allCharacters.filter(person => person.name.toLowerCase().indexOf(name.toLowerCase()) >= 0)
      swapi.get(person[0].url).then((individualResult) => {
      })
      res.send(person)
    }).catch((err) => res.send(err))

  }, 1000)
})

// planet retrieval completed
app.get('/planetresidents', (req, res) => {
  swapi.get('http://swapi.co/api/planets').then((result) => {
    var planets = result.results;
    var planetObject = {};
    planets.map(planet => {
      var residents = [];
      planet.residents.map(resident => {
        residents.push(resident)
        planetObject[planet.name] = residents
      })
    })
    for (let planet in planetObject) {
      planetObject[planet].map((resident, i) => {
        swapi.get(resident).then(result => planetObject[planet][i] = result.name).catch(err => res.send(err))
      })
    }
    setTimeout(() => res.send(planetObject), 2000)
  }).catch((err) => res.send(err))
})



app.listen(8080, () => console.log('Express is listening on port 8080'))
