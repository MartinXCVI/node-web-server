/* LIBRARIES IMPORTS */
// date-fns for manipulating JS dates in browsers and/or Node.js
import { format } from 'date-fns'
// Universally unique identifier that generates IDs using random numbers
import { v4 as uuid } from 'uuid'

/* NODE IMPORTS */
// Enables interacting with the file system
import fs from 'node:fs'
// API that provides asynchronous file system methods that return promises
import fsPromises from 'node:fs/promises'
// Provides utilities for working with file and directory paths
import path from 'node:path'
import { fileURLToPath } from 'node:url'


/* Implementation of __dirname in ES Modules */
// Getting the (url) file path
const __filename = fileURLToPath(import.meta.url)
// Getting the file's directory path
const __dirname = path.dirname(__filename)
// Getting the project's root path
const rootPath = path.join(__dirname, '..')

/* LOGGER FUNCTION */
const logEvents = async (message, logName)=> {
  // Date and time format with the 'format' module from date-fns
  const dateTime = `${format(new Date(), 'yyyy/MM/dd - HH:mm:ss')}`

  // Generate a timestamp and log entry with a unique identifier.
  const logItem = `[${dateTime}]\tID: ${uuid()}\t${message}\n`
  console.log(logItem)

  try {
    // If the logs directory does not exist, it gets created
    if(!fs.existsSync(path.join(rootPath, 'logs'))) {
      await fsPromises.mkdir(path.join(rootPath, 'logs'))
    }
    // Appending the log
    await fsPromises.appendFile(path.join(rootPath, 'logs', logName), logItem)
  } catch(error) {
    console.error(error)
  }
}

export default logEvents