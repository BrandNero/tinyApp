const { assert } = require('chai');

const { findUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('findUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedUser = testUsers["userRandomID"];
    assert.deepEqual(user, expectedUser);
  });
  it('should return undefined if email not in database', function() {
    const user = findUserByEmail("michaelMyers@yahoomail.com", testUsers);
    const expectedUser = undefined;
    assert.deepEqual(user, expectedUser);
  });
  it('should return undefined if email is empty string', function() {
    const user = findUserByEmail("", testUsers);
    const expectedUser = undefined;
    assert.deepEqual(user, expectedUser);
  });
});