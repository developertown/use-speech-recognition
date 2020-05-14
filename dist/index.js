
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./use-speech-recognition.cjs.production.min.js')
} else {
  module.exports = require('./use-speech-recognition.cjs.development.js')
}
