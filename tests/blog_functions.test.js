
const listHelper = require('../utils/list_helper')
const _ = require('lodash');

beforeEach(() => {
	
testdata = _.cloneDeep(listHelper.data);

// JSON.parse(JSON.stringify(listHelper.data))


})


describe('Dummy test', () => {
test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

})

describe('Total number of likes', () => {

  test('Total number of likes is zero', () => {

    testdata[0].likes=0
    testdata[1].likes=0
    testdata[2].likes=0
    testdata[3].likes=0
    
    const result = listHelper.totalLikes(testdata)
    expect(result).toBe(0)


  })

  test('Only one blog has likes', () => {

    testdata[0].likes=6
	testdata[1].likes=0
    testdata[2].likes=0
    testdata[3].likes=0
	
    const result = listHelper.totalLikes(testdata)
    expect(result).toBe(6)


  })

})


describe('Most likes', () => {

test('Which blog has most likes', () => {

  const result = listHelper.favoriteBlog(testdata)
  expect(result).toEqual(testdata[2])

})



test('All blogs except one has same amount of likes', () => {

  const result = listHelper.favoriteBlog(testdata)
  expect(result).toEqual(testdata[2])

})


})

describe('How has most blogs', () => {



  test('How has most blogs', () => {

    testdata[0].likes=8
    testdata[1].likes=4
    testdata[2].likes=8
    testdata[3].likes=2
  
    testdata[0].author='author2'
  
    const result = listHelper.mostBlogs(testdata)
    expect(result).toEqual({ author: 'author2', count: 2 })

  })

  test('Two blogges has more blog than others', () => {

    testdata[0].likes=8
    testdata[1].likes=4
    testdata[2].likes=8
    testdata[3].likes=2
  
    testdata[0].author='author2'
    testdata[3].author='author3'
  
    const result = listHelper.mostBlogs(testdata)
    expect(result).toEqual({ author: 'author2', count: 2 })
  })


})


describe('How has most likes', () => {

 
  test('Most liked blogger', () => {

	testdata[0].author='author2'

    const result = listHelper.mostLikes(testdata)
    expect(result).toEqual({ author: 'author2', likes: 12 })

  })

  test('All bloggers has zero likes', () => {

    testdata[0].likes=0
    testdata[1].likes=0
    testdata[2].likes=0
    testdata[3].likes=0

    const allhavezerolikes = testdata  

    const result = listHelper.mostLikes(allhavezerolikes)
    expect(result).toEqual({ author: 'author1', likes: 0 })
    
  })

})

