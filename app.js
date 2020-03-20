const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const env_vars = require('./utils/env_vars')
const logs = require('./utils/logs')
const middleware = require('./utils/middleware')
const routerBlogs = require('./controllers/blogs')
const routerUsers = require('./controllers/users')
const routerAuthentication = require('./controllers/userlogin')

const mongoUrl = env_vars.DBSTRING

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false,useCreateIndex: true,})


app.use(middleware.pullTokenFromRequest)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', routerBlogs)
app.use('/api/users', routerUsers)
app.use('/api/login', routerAuthentication)

app.use(middleware.exceptionCatcher) 

module.exports = app