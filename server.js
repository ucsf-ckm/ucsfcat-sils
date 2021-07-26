'use strict'

const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')

const linkMap = require('./linkMap')

const indexHtml = fs.readFileSync(path.join(__dirname, 'views', '/index.html'))

app.use(function (req, res, next) {
  res.header('Content-Type', 'text/html; charset=utf-8')
  next()
})

app.get('/', function (req, res) {
  return res.send(indexHtml.toString())
})

app.get('/go', function (req, res) {
  if (!req.query.link) {
    return res.send('Missing link. (Ha ha?) Please try again.')
  }

  const link = req.query.link.replace(/^https?:\/\/ucsfcat\.library\.ucsf\.edu\/record=(b\d+)~S0$/, '$1')

  const result = linkMap.get(link)
  if (!result) {
    return res.send('No result found for link.')
  }
  const newLink = `https://search.library.ucsf.edu/discovery/fulldisplay?docid=alma${result}&context=U&vid=01UCS_SAF:UCSF&lang=en`
  return res.send(`<a href="${newLink}">${newLink}</a>`)
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Now serving at http://localhost:${port}/.`)
})
