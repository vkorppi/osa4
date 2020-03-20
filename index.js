

const app = require('./app')
const http = require('http')
const env_vars = require('./utils/env_vars')
const logs = require('./utils/logs')
const webserv = http.createServer(app)


const PORT = env_vars.NODEPORT


webserv.listen(PORT, () => {
  logs.print(`Server running on port ${PORT}`)
})

