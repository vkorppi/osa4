

const blogCollection = require('../models/blog')
const userCollection = require('../models/user')
const mongoose = require('mongoose')
const list_helper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')
const httpclient = supertest(app) 
const _ = require('lodash');
const tokenSigner = require('jsonwebtoken')
 
testBlogsCopy=  _.cloneDeep(list_helper.data);
testUsersCopy = _.cloneDeep(list_helper.testUsers);
userToken = null

beforeAll(async () => {
	
	
   await userCollection.insertMany(testUsersCopy[0])	
   await blogCollection.insertMany(testBlogsCopy)

	const unasignedToken = {
		"username": testUsersCopy[0].username,
		"id": testUsersCopy[0]._id,
	}
	
	userToken = tokenSigner.sign(unasignedToken, process.env.STRINGINPUT)

});


describe('Does get return correct number of blogs', () => {
	  
  test('number of blogs', async () => {
   
	const bloglist=(await httpclient
	.get('/api/blogs'))
	.body
	
    expect(bloglist.length).toBe(4)

  })
  

  test('Property id is not missing', async () => {
   
    const bloglist= (await httpclient
	.get('/api/blogs'))
	.body
    expect(bloglist[0].id).toBeDefined();

  })
  
})

describe('Data modifying tests', () => { 


  

  
  test('Is likes updated', async () => { 
    
   likesToBeUpdated=
   {
     likes: 100
   }

    await httpclient
	.put(`/api/blogs/${testBlogsCopy[0]._id}`)
    .send(likesToBeUpdated)
	.set('content-type', 'application/json')

    const bloglist = (await httpclient
	.get('/api/blogs'))
   .body

    const updatedblog = bloglist.find(blog => blog.likes === 100);

    expect(updatedblog.likes).toBe(100)
  
  })
})

describe('Removing and adding', () => {

  test('Succesfully added new blog', async () => {


    newBlog =  {
      "title": "title4",
      "author": "author4",
      "url": "https://greenlivingguy.com/2020/02/mitch-evans-panasonic-team-wins-formula-e-in-mexico-city/",
      "likes": 2
	}

    const addedBlog = (await httpclient
	.post('/api/blogs')
	.send(newBlog)
	.set('content-type', 'application/json')
	.set('Authorization', 'Bearer '+userToken))
	.body
  
	delete addedBlog.id
	delete addedBlog.user
	
    expect(addedBlog).toEqual(newBlog)

  })
  
   test('Bearer missing when adding new blog', async () => {


    newBlog =  {
      "title": "title4",
      "author": "author4",
      "url": "https://greenlivingguy.com/2020/02/mitch-evans-panasonic-team-wins-formula-e-in-mexico-city/",
      "likes": 2
	}

    const response = await httpclient
	.post('/api/blogs')
	.send(newBlog)
	.set('content-type', 'application/json')

  
	expect(401).toBe(response.status)
	
    expect(response.body).toEqual({ error: 'token was invalid' })

  })
  
  
  test('Blog was removed', async () => { 
  
      newBlog2 =  {
      "title": "title5",
      "author": "author5",
      "url": "https://greenlivingguy.com/2020/02/mitch-evans-panasonic-team-wins-formula-e-in-mexico-city/",
      "likes": 2
	}
  
	 const blogToBeDel = (await httpclient
		.post('/api/blogs')
		.send(newBlog2)
		.set('content-type', 'application/json')
		.set('Authorization', 'Bearer '+userToken))
		.body

	var test = await httpclient
	.delete(`/api/blogs/${blogToBeDel.id}`)
	.set('Authorization', 'Bearer '+userToken) 
	
    
    const bloglist = (await httpclient
	.get('/api/blogs'))
	.body


    expect(bloglist.length).toBe(5)

  })

})

describe('No value given to likes property', () => {

  objectNullLikes=
  {
    "title": "title1",
    "author": "author1",
    "url": "https://greenlivingguy.com/2020/02/mitch-evans-panasonic-team-wins-formula-e-in-mexico-city/",
  }

  test('Empty like property', async () => {

    const addedBlog = (await httpclient
	.post('/api/blogs')
	.send(objectNullLikes)
	.set('content-type', 'application/json')
	.set('Authorization', 'Bearer '+userToken))
	.body

    expect(addedBlog.likes).toBe(0)
  })

})

describe('title and url are missing', () => {

  blogMissingProps=
  {
    author: "author1",
    likes: 8
  }

  test('properties title and url are obsolete', async () => {

    const httpResponse = await httpclient
	.post('/api/blogs')
	.send(blogMissingProps)
	.set('content-type', 'application/json')
	.set('Authorization', 'Bearer '+userToken)
    expect(400).toBe(httpResponse.status)

  })
  
})

afterAll(async () => {
	
	await userCollection.deleteMany({})
	await blogCollection.deleteMany({})
    mongoose.connection.close()
    console.log('Database connection closed')
  })

