//const app = require('../server')
const app = require('../src/server/index.js') // Link to your server file
const request = require('supertest')
//const request = supertest(app)

describe('Other Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true)
  })
})

describe('GET /user', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});