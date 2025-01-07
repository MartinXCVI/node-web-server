/* NODE IMPORTS */
// Module for HTTP data transfers
import http from 'node:http'
// Provides utilities for working with file and directory paths
import path from 'node:path'
// Enables interacting with the file system
import fs from 'node:fs'

import EventEmitter from 'node:events'
import { fileURLToPath } from 'node:url'

/* MODULES IMPORTS */
import logEvents from './logEvents.js'
import serveFile from './serveFile.js'

// Implementation of __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Emitter inherits EventEmitter props and methods
class Emitter extends EventEmitter {} // No additional props/methods

// Creating a new instance of the Emitter
const myEmitter = new Emitter()
// Logs writing to be executed when the event is triggered
myEmitter.on('logs', (msg, fileName)=> {
  logEvents(msg, fileName)}
)

// Port defining
const PORT = process.env.PORT || 3500

/* SERVER */
const server = http.createServer((req, res)=> {
  console.log(req.url, req.method)
  // Requests logs emitter
  myEmitter.emit('logs', `${req.url}\t${req.method}`, 'reqLog.txt')

  // Getting the extension from the path
  const extension = path.extname(req.url)
  // 'public' folder path
  const publicPath = path.join(__dirname, '..', 'public')
  // Static file path by request
  const staticFilePath = path.join(publicPath, req.url)

  // Supported MIME types
  const mimeTypes = {
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.mp4': 'video/mp4',
  }
  
  // Getting the extension from the MIME type
  const contentType = mimeTypes[extension] || 'text/html' // default if no type

  // Serve static files from the public directory
  if(fs.existsSync(staticFilePath) && !fs.lstatSync(staticFilePath).isDirectory()) {
    serveFile(staticFilePath, contentType, res, myEmitter)
    return
  }

  /* Serve dynamic HTML files */
  let filePath = '' // file path initialization

  if(req.url === '/') {
    // Serve the index.html for the root path
    filePath = path.join(__dirname, 'views', 'index.html')
  } else if (contentType === 'text/html') {
    // Serve other HTML files
    filePath = path.join(__dirname, 'views', req.url)
  }

  // Defaulting to 404.html if no Content-Type
  if(!contentType) {
    serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res, myEmitter)
  }

  // Makes the .html extension not required in the browser
  if(!extension && req.url.slice(-1) !== '/') {
    filePath += '.html'
  }

  // Checking if the file path is valid
  const fileExists = fs.existsSync(filePath)
  
  // Serving the file if true
  if(fileExists) {  
    serveFile(filePath, contentType, res, myEmitter)
  } else {
    switch(path.parse(filePath).base) {
      // 301 redirec
      case 'old-page':
        res.writeHead(301, { 'Location': '/new-page' })
        res.end('Redirecting to the new page...')
        break
      case 'www-page':
        res.writeHead(301, { 'Location': '/' })
        res.end()
        break
      default:
        // Serve a 404 response
        console.log('Invalid URL: ', req.url)
        // Emitting the error to the errorLog file
        myEmitter.emit('logs', `404 Not Found: ${req.url}`, 'errorLog.txt')
        serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res, myEmitter)
    }
  }
}) // End of server

/* SERVER LISTENER */
server.listen(PORT, ()=> {
  console.log(`Server listening on port ${PORT}...`)
})