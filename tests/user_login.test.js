

const userCollection = require('../models/user')
const blogCollection = require('../models/blog')
const mongoose = require('mongoose')
const utils_help = require('../utils/list_helper')
const bcrypt = require('bcryptjs');
const supertest = require('supertest')
const app = require('../app')
const httpclient = supertest(app)
const User = require('../models/user')
const list_helper = require('../utils/list_helper')
const _ = require('lodash');

const tokensigner = require('jsonwebtoken')

testUsersCopy = _.cloneDeep(list_helper.testUsers);

var newuser

// testBlogsCopy = _.cloneDeep(list_helper.data);

beforeAll(async () => {
	
	
     newuser = (await httpclient
		.post('/api/users')
		.send(testUsersCopy[0])
		.set('content-type', 'application/json')
		).body
 
 });


 
describe('Good cedentials', () => {

	test('Correct username and password', async () => {


		
		httpResponse = await httpclient
		.post('/api/login')
		.send(testUsersCopy[0])
		.set('content-type', 'application/json')

		var token = httpResponse.body.userToken


		const decodedToken = tokensigner.verify(token, process.env.STRINGINPUT)
		const user = await (await User.findById(decodedToken.id)).toJSON()

		expect(user).toEqual(newuser)
		
		expect(200).toBe(httpResponse.status)
	
		
	})
	
	
})

 
describe('Bad cedentials', () => {
	
	
	test('Wrong username', async () => {
		
		newuser.username = 'invalidusername'

		httpResponse = await httpclient
			.post('/api/login')
			.send(newuser)
			.set('content-type', 'application/json')
			
		
		errormsg = 'Login failed'

		expect({ error: errormsg }).toEqual(httpResponse.body)

		expect(401).toBe(httpResponse.status)

	})
	
	test('Wrong password', async () => {
		
		newuser.username= testUsersCopy[0].username
		newuser.password= 'invalidpassword'

		httpResponse = await httpclient
		.post('/api/login')
		.send(newuser)
		.set('content-type', 'application/json')
		


		errormsg = 'Login failed'
		expect({ error: errormsg }).toEqual(httpResponse.body)

		expect(401).toBe(httpResponse.status)
		
	})

	test('Wrong username and password', async () => {

		newuser.username ='invalidusername'
		newuser.password ='invalidpassword'

		httpResponse = await httpclient
		.post('/api/login')
		.send(newuser)
		.set('content-type', 'application/json')
		
		
		errormsg = 'Login failed'
		expect({ error: errormsg }).toEqual(httpResponse.body)
		
		expect(401).toBe(httpResponse.status)

	})


})




afterAll(async () => {
	
	await userCollection.deleteMany({})
    mongoose.connection.close()
    console.log('Database connection closed')
  })

