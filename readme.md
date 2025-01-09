# Node.js Web Server

## 📄 Introduction

This project is a lightweight, modular web server built with Node.js. It demonstrates core concepts of server-side programming without relying on frameworks, focusing on:

- Event-driven architecture using Node.js `EventEmitter`.
- Asynchronous file handling with `fs/promises`.
- Dynamic MIME type handling for serving static and dynamic files.
- Modular code organization with dedicated utilities for logging and file serving.

## 🛠️ Features

- **Static File Serving**: Supports serving files (CSS, JavaScript, images, etc.) from a `public` directory.
- **Dynamic Routing**: Dynamically resolves routes for `.html` files in a `views` directory.
- **Custom Logging**: Logs requests and errors into separate log files (`reqLog.txt`, `errorLog.txt`) using a unique ID for each log entry.
- **404 Handling**: Serves a custom `404.html` page for invalid routes.
- **Redirects**: Handles specific redirects with status code `301`.
- **MIME Type Support**: Supports a wide range of MIME types, including `text/html`, `application/json`, and various image formats.

## 🗂️ Project Structure

```plaintext
├── logs/                 # Directory for generated log files
|     ├── errorLog.txt    # Errors logs text file
|     └── reqLog.txt      # Requests logs text file
├── node_modules/         # Node modules
├── public/               # Directory for static assets (CSS, JS, images, etc.)
|      └── css/           # CSS stylesheets
|      └── img/           # Images directory
└── src/                  # App source directory
     ├── views/           # Directory for HTML files
     ├── server.js        # Main server file
     ├── logEvents.js     # Logging utility
     └── serveFile.js     # File serving utility
```

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MartinXCVI/node-web-server
   ```

2. Navigate to the project directory:
   ```bash
   cd node-web-server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3500
   ```

## ⚙️ Environment Variables
- `PORT`: Define the port number for the server. Defaults to `3500` if not specified.

## 📋 How It Works

### Request Handling
1. Logs every incoming request (URL and method) to `reqLog.txt`.
2. Serves files from the `public` directory if they exist and match the request.
3. For dynamic routes:
   - Serves HTML files from the `views` directory.
   - Redirects or serves a `404.html` page if the file doesn't exist.

### Logging
- All logs are timestamped and include a unique ID.
- Logs are written to the `logs` directory, with separate files for requests and errors.

### Error Handling
- Errors encountered while serving files are logged in `errorLog.txt`.
- A generic `500 Internal Server Error` response is sent if file serving fails.

## 📚 Learn More
- [Node.js latest documentation](https://nodejs.org/docs/latest/api/)
- [Introduction to Node.js](https://nodejs.org/es/learn/getting-started/introduction-to-nodejs)
- [Nodemon project website](https://nodemon.io/)
- [date-fns official documentation](https://date-fns.org/docs/Getting-Started)
- [UUID repository](https://github.com/uuidjs/uuid#readme)

## 🧑‍💻 Developer:

- [**MartinXCVI**](https://github.com/MartinXCVI)