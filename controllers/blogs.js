
const routerBlogs = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const tokensigner = require('jsonwebtoken')
const _ = require('lodash');

routerBlogs.get('/',async(request, response) => {

      const blogs = await Blog.find({}).populate('user', { username: 1,password: 1,name: 1})
      response.json(blogs)
	  
  })

    
  routerBlogs.post('/', async(request, response) => {
	    
	var blog = request.body
	
  const decodedToken =  tokensigner.verify(request.token,process.env.STRINGINPUT)

	const user = await User.findById(decodedToken.id)
	
	if (!user) {    
	   return response.status(401).json({ error: 'token did not match any user' })  
	}
	
	
      if (typeof blog.title === "undefined" || typeof blog.url === "undefined") {
        response.status(400).json('')
      }
      else {
        if(typeof blog.likes === "undefined") {
          blog.likes=0
        }
		
		const newBlog = new Blog(blog)
		
		newBlog.user = user._id
		
        const result = await newBlog.save()
		
		user.blogs = user.blogs.concat(result._id)
		
		updatedUser = new User({
			"blogs": user.blogs
		}).toJSON()
				
		await User.findByIdAndUpdate(user._id, updatedUser)
		
        response.status(201).json(result)

     }
  })

  routerBlogs.delete('/:id', async(request, response) => {

    const decodedToken =  tokensigner.verify(request.token,process.env.STRINGINPUT)

    const blog =await (await Blog.findById(request.params.id)).toJSON()

    
    if(blog.user.toString() === decodedToken.id.toString()) {
     
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }
    else {
      return response.status(401).json({ error: 'Can not remove blog' })  
    }
    

    
  })

  routerBlogs.put('/:id', async(request, response) => {

    const body = request.body


   const blog = new Blog({
    "likes": body.likes
  }).toJSON()
  

     modifyiedBlog = await Blog.findByIdAndUpdate(request.params.id, blog)
     response.json(modifyiedBlog)
  })
  
  module.exports = routerBlogs