
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: String,
    name: String
	,
	blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
  
  })

  userSchema.set('toJSON', {
    transform: (document, databaseObj) => {
      databaseObj.id = databaseObj._id.toString()
      delete databaseObj._id
      delete databaseObj.__v
    }
  })
  
  module.exports =  mongoose.model('User', userSchema)