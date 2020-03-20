

const bcrypt = require('bcryptjs');
const AuthenticationRouter = require('express').Router()
const userToken = require('jsonwebtoken')
const User = require('../models/user')
const tokenSigner = require('jsonwebtoken')


AuthenticationRouter.post('/', async (request, response) => {
	
	const userCredentials = {
		"username": request.body.username,
		"password": request.body.password
	}

	const userAccount = await User.findOne({ username: userCredentials.username })	

	if (!userAccount) {

		return response.status(401)
		.json({
			error: 'Login failed'
		})
	}


	const isPasswordCorrect = await bcrypt.compare(userCredentials.password, userAccount.password)


	if (!isPasswordCorrect) {

		return response.status(401)
		.json({
			error: 'Login failed'
		})
	}
	
	const unasignedToken = {
		username: userAccount.username,
		id: userAccount._id,
	}
	
	const userToken = tokenSigner.sign(unasignedToken, process.env.STRINGINPUT)
	 
	response
    .status(200)
    .send({ userToken, username: userAccount.username, name: userAccount.name })

})

module.exports = AuthenticationRouter