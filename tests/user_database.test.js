

const userCollection = require('../models/user')
const blogCollection = require('../models/blog')
const mongoose = require('mongoose')
const utils_help = require('../utils/list_helper')
const bcrypt = require('bcryptjs');
const supertest = require('supertest')
const app = require('../app')
const httpclient = supertest(app)
const list_helper = require('../utils/list_helper')
const _ = require('lodash');
const tokenSigner = require('jsonwebtoken')

testUsersCopy = _.cloneDeep(list_helper.testUsers);

testBlogsCopy = _.cloneDeep(list_helper.data);




describe('User listing and new user creation', () => {

  test('New user', async () => {

    const newuser = (await httpclient
	.post('/api/users')
	.send(testUsersCopy[0])
	.set('content-type', 'application/json')
	).body
    
	const userpassword = newuser.password
	
	expect( bcrypt.compareSync('password', userpassword) ).toBe(true)
    expect(newuser.username === 'username').toBe(true)
	expect(newuser.name === 'testuser').toBe(true)
  })
  
  test('All created users', async () => {

     await httpclient
	 .post('/api/users')
	 .send(testUsersCopy[1])
	 .set('content-type', 'application/json')
	 
     const userlist = (await httpclient
	 .get('/api/users'))
	 .body
	 
	 expect(userlist.length).toBe(2)

  })

})



describe('Password or username is missing', () => {
	

	
	test('Password is missing', async () => {
		

		testuser = testUsersCopy[2]
		delete testuser.password
				
		const httpResponse = (await httpclient
		.post('/api/users')
		.send(testuser)
		.set('content-type', 'application/json'))
		
		const newuser = httpResponse.body
		
		expect(httpResponse.status).toBe(400)
		errormsg = 'Username or password is missing'
		expect({ error: errormsg })
		.toEqual(newuser)
		
	})
	
	test('Username is missing', async () => {
		

		testuser = testUsersCopy[3]
		delete testuser.username
		
		const httpResponse = (await httpclient
		.post('/api/users')
		.send(testuser)
		.set('content-type', 'application/json'))
		const newuser = httpResponse.body
		
		expect(httpResponse.status).toBe(400)
		errormsg = 'Username or password is missing'
		expect({ error: errormsg }).toEqual(newuser)
		
	})
	
	test('username and password are missing', async () => {
		
		testuser = testUsersCopy[4]
		
		delete testuser.username
		delete testuser.password
		
		const httpResponse = await httpclient
		.post('/api/users')
		.send(testuser)
		.set('content-type', 'application/json')
		
		const newuser = httpResponse.body
		
		expect(httpResponse.status).toBe(400)
		errormsg = 'Username or password is missing'
		expect({ error: errormsg }).toEqual(newuser)
	})
	

})

describe('Password or username is length is less than three', () => {
	
	test('username too short', async () => {

		testuser = testUsersCopy[5]
		testuser.username = 'us'
		
		const httpResponse = await httpclient
		.post('/api/users')
		.send(testuser)
		.set('content-type', 'application/json')
		
		const newuser = httpResponse.body
		
		expect(httpResponse.status).toBe(403)
		errormsg = 'Length of username or password is less than three' 
		expect({ error: errormsg}).toEqual(newuser)
	})
	
	test('password too short', async () => {
		

		testuser = testUsersCopy[6]
		testuser.password = 'p'
		
		const httpResponse = await httpclient
		.post('/api/users')
		.send(testuser)
		.set('content-type', 'application/json')
		
		const newuser = httpResponse.body
		
		expect(httpResponse.status).toBe(403)
		errormsg= 'Length of username or password is less than three'
		expect({ error: errormsg }).toEqual(newuser)
	})
	
	
})

describe('Duplicate username', () => {
		
	test('Username already exists', async () => {
		
		
		testuser = testUsersCopy[7]
		testuser2 = testUsersCopy[8]
		testuser2.username = testuser.username
		
		 await httpclient
		.post('/api/users')
		.send(testuser)
		.set('content-type', 'application/json')
		
		const httpResponse2 = await httpclient
		.post('/api/users')
		.send(testuser2)
		.set('content-type', 'application/json')
	
		expect(httpResponse2.status).toBe(400)
		errormsg = 'Duplicate username'
		expect({ error: errormsg }).toEqual(httpResponse2.body)
		
	})
	
})



describe('Is populate working for bloglist and userlist', () => {

	beforeAll(async () => {
	
		await userCollection.deleteMany({})
		await blogCollection.deleteMany({})
	 
	 });
	
	test('Populate works with blogs', async () => {
		
		testuser  = testUsersCopy[9]
		
		newtestuser = (await httpclient
		.post('/api/users')
		.send(testuser)
		.set('content-type', 'application/json')).body
		
		const unasignedToken = {
			"username": newtestuser.username,
			"id": newtestuser.id,
		}
		const usertoken = tokenSigner.sign(unasignedToken, process.env.STRINGINPUT)

		
		for (var i = 0; i < 2 ;) {
			
			var blog =await httpclient
			.post('/api/blogs')
			.send(testBlogsCopy[i])
			.set('content-type', 'application/json')
			.set('Authorization', 'Bearer '+usertoken)
			
			
			i++;
		}
	
		const bloglist=(await httpclient
		.get('/api/blogs'))
		.body
		
		const userlist=(await httpclient
		.get('/api/users'))
		.body
		
		delete newtestuser.blogs

		expect(bloglist[0].user).toEqual(newtestuser)
		expect(bloglist[1].user).toEqual(newtestuser)

		delete bloglist[0].user
		delete bloglist[1].user

		expect(userlist[0].blogs[0]).toEqual(bloglist[0])
		expect(userlist[0].blogs[1]).toEqual(bloglist[1])
		
	})

})

describe('Test token', () => {
	
	
	// http post login
	
	const response = null
	
	
	
	
})

afterAll(async () => {
	
	await userCollection.deleteMany({})
	await blogCollection.deleteMany({})
    mongoose.connection.close()
    console.log('Database connection closed')
  })

