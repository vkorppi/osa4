
const User = require('../models/user')
const bcrypt = require('bcryptjs');
const routerUsers = require('express').Router()


const errorHandler = (error, request, response, next) => {

  if (error.name === 'MongoError' && error.code === 11000) {
    return response.status(400).send({ error: 'Duplicate username' })
  }

  next(error)
}


routerUsers.post('/', async(request, response,next) => {
	
	const newuser=request.body
	
	if(typeof newuser.password === "undefined" || typeof newuser.username === "undefined") {
		return response.status(400).json({ error: 'Username or password is missing' })
	}
	
	if(newuser.password.length < 3 || newuser.username.length < 3) {
		return response.status(403).json({ error: 'Length of username or password is less than three' })
	}
	
	
	const hashval =  bcrypt.hashSync(newuser.password,10);
	
	const user = new User({
		username: newuser.username,
		password: hashval,
		name: newuser.name
	})
	  
	const createduser = await user.save().catch(error => next(error))
		
	response.json(createduser)
  })

routerUsers.get('/',async(request, response) => {

      const users = await User.find({}).populate('blogs',{ title: 1, author: 1, url: 1, likes: 1})
      response.json(users.map(u => u.toJSON()))

  })



 routerUsers.use(errorHandler)
  
  module.exports = routerUsers