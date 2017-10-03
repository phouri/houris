const express = require('express')
const app = express()
const crypto = require('crypto')
const models = require('./models')

app.use(express.static('dist'))

/**
 * Insert a visit record into the database.
 *
 * @param {object} knex The Knex connection object.
 * @param {object} visit The visit record to insert.
 * @returns {Promise}
 */
function insertVisit (visit) {
  return models.visits.create(visit)
}

/**
 * Retrieve the latest 10 visit records from the database.
 *
 * @param {object} knex The Knex connection object.
 * @returns {Promise}
 */
function getVisits (knex) {
  return models.visits.findAll({limit: 10, attributes: ['timestamp', 'userIp'], order: ['timestamp']})
    .then((results) => {
      return results.map((visit) => `Time: ${visit.timestamp}, AddrHash: ${visit.userIp}`)
    })
}

app.use('*', (req, res, next) => {
  next()
  try {
  // Create a visit record to be stored in the database
    const visit = {
      timestamp: new Date(),
      // Store a hash of the visitor's ip address
      userIp: crypto.createHash('sha256').update(req.ip).digest('hex').substr(0, 7)
    }
    insertVisit(visit)
  } catch (e) {
    console.log('Error!', e)
  }
})

app.get('/visits', (req, res, next) => {
  // Query the last 10 visits from the database.
  getVisits()
  .then((visits) => {
    res
      .status(200)
      .set('Content-Type', 'text/plain')
      .send(`Last 10 visits:\n${visits.join('\n')}`)
      .end()
  })
  .catch((err) => {
    next(err)
  })
})

const PORT = process.env.PORT || 8080

app.listen(PORT, (e) => {
  if (e) {
    console.error('Error initializing', e)
  } else {
    console.log('Listening on 8080')
  }
})
