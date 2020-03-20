
const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number		
	,
	user: {
	type: mongoose.Schema.Types.ObjectId,
	ref: 'User'
	}
	
  })

  blogSchema.set('toJSON', {
    transform: (document, databaseObj) => {
      databaseObj.id = databaseObj._id.toString()
      delete databaseObj._id
      delete databaseObj.__v
    }
  })
  
  module.exports =  mongoose.model('Blog', blogSchema)