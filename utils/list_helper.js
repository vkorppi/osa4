

var collection = require('lodash/collection');
var object = require('lodash/object');
var math = require('lodash/math');
var _ = require('lodash');


const dummy = (blogs) => {
    return 1
  }
  
  const totalLikes  = (blogs) => {

    const countLikes = (allLikes, blog) => {
      return allLikes + blog.likes
    }

    if(blogs.length > 0) {

      return blogs.reduce(countLikes, 0)
    }

    return 0
  }

  const favoriteBlog   = (blogs) => {

    const mostLikes = (mostLikes, blog) => {

      if(mostLikes.likes < blog.likes) {
        return blog
      }
      else if(mostLikes.likes > blog.likes) {
        return mostLikes
      }
      else  {
        return blog
      }
    }

    return blogs.reduce(mostLikes, 0)

  }

  const mostBlogs    = (blogs) => {

    authorwithmostblogs= _.chain(blogs).countBy('author')
    .map( (count,author) => { return { 'author': author,'count': count } })
    .maxBy((blogger) => { return blogger.count; })
    .value()

    return authorwithmostblogs
  }

  const mostLikes    = (blogs) => {

    authorwithmostlikes = _.chain(blogs).groupBy('author')
    .map((likes, author) => { return { 'author': author,'likes': _.sumBy(likes, 'likes') }})
    .maxBy('likes')
    .value()

    return authorwithmostlikes;
  }
  
  
  
 data = [

  {
    _id: "5e5289036bd6e206c4a83f95",
    title: "title1",
    author: "author1",
    url: "https://greenlivingguy.com/2020/02/mitch-evans-panasonic-team-wins-formula-e-in-mexico-city/",
    likes: 8,
    __v: 0
    },
    {
    _id: "5e5289176bd6e206c4a83f96",
    title: "title2",
    author: "author2",
    url: "https://greenlivingguy.com/2020/02/mitch-evans-panasonic-team-wins-formula-e-in-mexico-city/",
    likes: 4,
    __v: 0
    },
    {
    _id: "5e5289286bd6e206c4a83f97",
    title: "title3",
    author: "author3",
    url: "https://greenlivingguy.com/2020/02/mitch-evans-panasonic-team-wins-formula-e-in-mexico-city/",
    likes: 8,
    __v: 0
    },
    {
    _id: "5e52893d6bd6e206c4a83f98",
    title: "title4",
    author: "author4",
    url: "https://greenlivingguy.com/2020/02/mitch-evans-panasonic-team-wins-formula-e-in-mexico-city/",
    likes: 2,
    __v: 0
    }

  
  ]
  
  	testUsers =[
		{
			"username": "username",
			"password": "password",
			"name": "testuser",
			"_id":"5e68d124cd3d6f2e4c549cb0"
		},
		{
			"username": "username2",
			"password": "password2",
			"name": "testuser2",
			"_id":"5e68d156913b220ac070914b"
		},
		{
			"username": "username3",
			"password": "password3",
			"name": "testuser3",
			"_id":"5e68d172d7fe5b0520866637"
		},
		{
			"username": "username4",
			"password": "password4",
			"name": "testuser4",
			"_id":"5e68d19685d62a2a3498ea5a"
		},
		{
			"username": "username5",
			"password": "password5",
			"name": "testuser5",
			"_id":"5e68d1bec3f82512b0b72003"
		},
		{
			"username": "username6",
			"password": "password6",
			"name": "testuser6",
			"_id":"5e68d1d38d31c527047d9bf3"
		},
		{
			"username": "username7",
			"password": "password7",
			"name": "testuser7",
			"_id":"5e68d20b34bbf2084ce94f71"
		},
		{
			"username": "username8",
			"password": "password8",
			"name": "testuser8",
			"_id":"5e68d2273172e10a5c3cf743"
		},
		{
			"username": "username9",
			"password": "password9",
			"name": "testuser9",
			"_id":"5e68d242dda5922df07ff434"
		},
		{
			"username": "username10",
			"password": "password10",
			"name": "testuser10",
			"_id":"5e68d1f23d698c2c98e297de"
		}
	]

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    data,
	testUsers
  }