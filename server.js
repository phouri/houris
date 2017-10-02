const express = require('express')
const app = express()

app.use(express.static('dist'))

app.listen(8080, (e) => {
  if (e) {
    console.error('Error initializing', e);
  } else {
    console.log('Listening on 8080')
  }
})
