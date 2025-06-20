// IMPORTANT: Set the `github_token` environment variable to a personal access token with at least the `public_repo` scope for the API.
// The `PORT` environment variable can also be set to control the port the server should be hosted on.
import path, {dirname} from 'node:path'
import {fileURLToPath} from 'node:url'
import process from 'node:process'
import express from 'express'
import minify from 'express-minify'
import favicon from 'serve-favicon'
import tempDirectory from 'temp-dir'
import cors from 'cors'

import postRoute from './routes/post.js'
import getRoute from './routes/get.js'

// Server
const PORT = process.env.PORT || 3000

const directoryName = dirname(fileURLToPath(import.meta.url))

// Prepare application
const app = express()
app.use(
  minify({
    cache: tempDirectory,
  }),
)
app.use(favicon(path.join(directoryName, 'favicon.ico')))
app.set('views', path.join(directoryName, '/licenses'))

// Setup static files
app.use('/robots.txt', express.static('robots.txt'))
app.use('/favicon.ico', express.static(`${directoryName}/favicon.ico`))
app.use('/themes', express.static(path.join(directoryName, 'themes')))

// Middleware

// CORS
app.use(cors())
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(
  express.urlencoded({
    extended: true,
  }),
)
// Parse JSON bodies (as sent by API clients)
app.use(express.json())

// HTTP endpoints
app.post('/', postRoute)
app.get('/*', getRoute)

// Start listening for HTTP requests
app.listen(PORT, () => {
  console.log(`🚀 on http://localhost:${PORT}`)
})
