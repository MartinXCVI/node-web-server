/* NODE IMPORTS */
// API that provides asynchronous file system methods that return promises
import fsPromises from 'node:fs/promises'

const serveFile = async (filePath, contentType, response, myEmitter)=> {
  try {
    // Checking preventively if headers are already sent
    if(response.headersSent) {
      return
    }
    // Reading the file asynchronously; decodes unless it's an image
    const rawData = await fsPromises.readFile(
      filePath,
      contentType.includes('image') ? null : 'utf8'
    )
    // Parses JSON files if needed, or uses raw data for other content types
    const data = contentType === 'application/json'
      ? JSON.parse(rawData) : rawData
    
    // Sets response headers and status code; serves file accordingly
    response.writeHead(
      filePath.includes('404.html') ? 404 : 200,
      { 'Content-Type': contentType }
    )
    response.end(
      contentType === 'application/json' ? JSON.stringify(data) : data
    )
  } catch(error) {
    console.error('Error while serving file - ', `${error.name}: ${error.message}`)
    try {
      // Error logs emitter
      myEmitter.emit('logs', `${error.name}: ${error.message}`, 'errorLog.txt')
    } catch(error) {
      // Logging the errors emitter's error in the console if it fails
      console.error('Failed to log error:', error)
    }
    response.statusCode = 500
    response.end('Internal Server Error')
  }
} // End of serveFile

export default serveFile