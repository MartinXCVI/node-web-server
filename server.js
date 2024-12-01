const http = require('node:http')
const path = require('node:path')
const fs = require('node:fs')
const fsPromises = require('node:fs/promises')

const logEvents = require('./logEvents')
const EventEmitter = require('events')
class Emitter extends EventEmitter {};

// initialize the object
const myEmitter = new Emitter()
myEmitter.on('logs', (msg, fileName)=> logEvents(msg, fileName))
const PORT = process.env.PORT || 3500

const serveFile = async (filePath, contentType, response)=> {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes('image') ? 'utf8' : ''
    )
    const data = contentType === 'application/json'
      ? JSON.parse(rawData) : rawData
    response.writeHead(
      filePath.includes('404.html') ? 404 : 200,
      { 'Content-Type': contentType })
    response.end(
      contentType === 'application/json' ? JSON.stringify(data) : data
    )
  } catch(error) {
    console.error(error)
    myEmitter.emit('logs', `${error.name}: ${error.message}`, 'errorLog.txt')
    response.statusCode = 500
    response.end()
  }
}

const server = http.createServer((req, res)=> {
  console.log(req.url, req.method)
  myEmitter.emit('logs', `${req.url}\t${req.method}`, 'reqLog.txt')

  const extension = path.extname(req.url)
  let contentType

  switch(extension) {
    case '.css':
      contentType = 'text/css'
      break
    case '.js':
      contentType = 'text/javascript'
      break
    case '.json':
      contentType = 'application/json'
      break
    case '.jpg':
      contentType = 'image/jpeg'
      break
    case '.png':
      contentType = 'image/png'
      break
    case '.txt':
      contentType = 'text/plain'
      break
    default:
      contentType = 'text/html' 
  }

  let filePath
  
  if(contentType === 'text/html' && req.url === '/') {
    filePath = path.join(__dirname, 'views', 'index.html')
  } else if(contentType === 'text/html' && req.url.slice(-1) === '/') {
    filePath = path.join(__dirname, 'views', req.url, 'index.html')
  } else if(contentType === 'text/html') {
    filePath = path.join(__dirname, 'views', req.url)
  } else {
    filePath = path.join(__dirname, req.url)
  }

  // Makes the .html extension not required in the browser
  if(!extension && req.url.slice(-1) !== '/') {
    filePath += '.html'
  }

  const fileExists = fs.existsSync(filePath)

  if(fileExists) {
    // Serve the file
    serveFile(filePath, contentType, res)
  } else {
    switch(path.parse(filePath).base) {
      // 301 redirec
      case 'old-page.html':
        res.writeHead(301, { 'Location': '/new-page.html' })
        res.end()
        break
      case 'www-page.html':
        res.writeHead(301, { 'Location': '/' })
        res.end()
        break
      default:
        // Serve a 404 response
        serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res)
    }
  }
}) // End of server

server.listen(PORT, ()=> {
  console.log(`Server listening on port ${PORT}...`)
})