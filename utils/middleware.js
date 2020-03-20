
const _ = require('lodash');


const pullTokenFromRequest = (request, response, next) => {
   
    const authAttribute = request.get('authorization')

    var hasToken= _.chain(authAttribute)
    .trim()
    .toLower()
    .startsWith('bearer ')
    .value()
    
    if(hasToken) {
        request.token = _.chain(authAttribute)
        .trim()
        .split(' ')
        .value()[1]
    }
	else {
        request.token =null
    }
  
    next()
  }

  const exceptionCatcher = (error, request, response, next) => {

    if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({ error: 'token was invalid' })
    }
  
    next(error)
  }


  
  module.exports = {
    pullTokenFromRequest,
    exceptionCatcher
  }