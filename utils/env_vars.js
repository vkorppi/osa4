require('dotenv').config()

NODEPORT = process.env.SERVERPORT
DBSTRING = process.env.DATABASESTRING


if (process.env.ENVIR === 'test') {
  DBSTRING = process.env.DATABASESTRINGTEST
}


module.exports = {
  DBSTRING,
  NODEPORT
}