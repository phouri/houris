const express = require('express')
const app = express()
const Knex = require('knex')
const crypto = require('crypto')

let knex = connect()

function connect () {
  const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
  }

  if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
    config.host = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
  }
  console.log('Connecting...')
  // Connect to the database
  const knex = Knex({
    client: 'mysql',
    connection: config
  })

  knex.schema.hasTable('visits')
  .then((exists) => {
    console.log('Exists?', exists)
    if (!exists) {
      return knex.schema.createTable('visits', (table) => {
        table.increments()
        table.timestamp('timestamp')
        table.string('userIp')
      }).catch((e) => {
        console.error('Error creating', e)
      })
    }
  }).catch(e => console.error('Error existing', e))

  return knex
}

app.use(express.static('dist'))

/**
 * Insert a visit record into the database.
 *
 * @param {object} knex The Knex connection object.
 * @param {object} visit The visit record to insert.
 * @returns {Promise}
 */
function insertVisit (knex, visit) {
  return knex('visits').insert(visit)
}

/**
 * Retrieve the latest 10 visit records from the database.
 *
 * @param {object} knex The Knex connection object.
 * @returns {Promise}
 */
function getVisits (knex) {
  return knex.select('timestamp', 'userIp')
    .from('visits')
    .orderBy('timestamp', 'desc')
    .limit(10)
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
    insertVisit(knex, visit)
  } catch (e) {
    console.log('Error!', e)
  }
})

app.get('/visits', (req, res, next) => {
  // Query the last 10 visits from the database.
  getVisits(knex)
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
